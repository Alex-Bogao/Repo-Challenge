using ChallengeIntuit.Backend.Data;
using ChallengeIntuit.Backend.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

namespace ChallengeIntuit.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class ClientesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ClientesController> _logger;

        public ClientesController(AppDbContext context, IConfiguration configuration, ILogger<ClientesController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene el listado completo de clientes.
        /// </summary>
        /// <returns>Una lista de clientes.</returns>
        /// <response code="200">Retorna la lista de clientes</response>
        /// <response code="500">Si ocurre un error interno en el servidor</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            try
            {
                return await _context.Clientes.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener la lista de clientes.");
                return StatusCode(500, "Ocurrió un error interno al procesar su solicitud.");
            }
        }

        /// <summary>
        /// Obtiene un cliente específico por su ID.
        /// </summary>
        /// <param name="id">El ID del cliente a buscar.</param>
        /// <returns>El objeto cliente si es encontrado.</returns>
        /// <response code="200">Retorna el cliente solicitado</response>
        /// <response code="404">Si el cliente no existe</response>
        [HttpGet("Get/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            try
            {
                var cliente = await _context.Clientes.FindAsync(id);

                if (cliente == null)
                {
                    return NotFound($"No se encontró el cliente con ID {id}");
                }

                return cliente;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al obtener el cliente con ID {id}.");
                return StatusCode(500, "Ocurrió un error interno.");
            }
        }

        /// <summary>
        /// Busca clientes por nombre o apellido utilizando un Stored Procedure.
        /// </summary>
        /// <param name="texto">Texto a buscar dentro del nombre o apellido.</param>
        /// <returns>Lista de clientes que coinciden.</returns>
        /// <response code="200">Retorna los clientes encontrados</response>
        /// <response code="400">Si no se envía texto de búsqueda</response>
        /// <response code="404">Si no se encuentran coincidencias</response>
        [HttpGet("Buscar")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<Cliente>>> SearchClientes([FromQuery] string texto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(texto))
                {
                    return BadRequest("Debe ingresar un texto para buscar.");
                }

                using (var connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    var sql = "sp_BuscarClientesPorNombre";
                    var resultados = await connection.QueryAsync<Cliente>(
                        sql,
                        new { p_busqueda = texto },
                        commandType: System.Data.CommandType.StoredProcedure
                    );

                    if (!resultados.Any())
                    {
                        return NotFound("No se ha encontrado ningún nombre o apellido que coincida.");
                    }

                    return Ok(resultados);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al buscar clientes con el texto: {texto}.");
                return StatusCode(500, "Ocurrió un error interno durante la búsqueda.");
            }
        }

        /// <summary>
        /// Crea un nuevo cliente en la base de datos.
        /// </summary>
        /// <param name="clienteDto">Datos del cliente a crear.</param>
        /// <returns>El cliente creado con su ID asignado.</returns>
        /// <response code="201">Cliente creado exitosamente</response>
        /// <response code="400">Si el CUIT o Email ya existen, o los datos son inválidos</response>
        [HttpPost("Insert")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Cliente>> PostCliente(ClienteDto clienteDto)
        {
            try
            {
                if (await _context.Clientes.AnyAsync(c => c.Cuit == clienteDto.Cuit))
                {
                    return BadRequest("El CUIT ya existe en la base de datos.");
                }
                if (await _context.Clientes.AnyAsync(c => c.Email == clienteDto.Email))
                {
                    return BadRequest("El Email ya existe en la base de datos.");
                }

                var nuevoCliente = new Cliente
                {
                    Nombre = clienteDto.Nombre,
                    Apellido = clienteDto.Apellido,
                    RazonSocial = clienteDto.RazonSocial,
                    Cuit = clienteDto.Cuit,
                    FechaNacimiento = DateTime.Parse(clienteDto.FechaNacimiento),
                    TelefonoCelular = clienteDto.TelefonoCelular,
                    Email = clienteDto.Email,
                    FechaCreacion = DateTime.Now,
                    FechaModificacion = DateTime.Now
                };

                _context.Clientes.Add(nuevoCliente);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetCliente", new { id = nuevoCliente.Id }, nuevoCliente);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear un nuevo cliente.");
                return StatusCode(500, "Error interno al guardar el cliente.");
            }
        }

        /// <summary>
        /// Actualiza los datos de un cliente existente.
        /// </summary>
        /// <param name="id">ID del cliente a actualizar.</param>
        /// <param name="clienteDto">Nuevos datos del cliente.</param>
        /// <response code="204">Actualización exitosa (sin contenido)</response>
        /// <response code="404">Si el cliente no existe</response>
        [HttpPut("Update/{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutCliente(int id, ClienteDto clienteDto)
        {
            try
            {
                var clienteExistente = await _context.Clientes.FindAsync(id);

                if (clienteExistente == null)
                {
                    return NotFound($"No existe el cliente con ID {id}");
                }

                clienteExistente.Nombre = clienteDto.Nombre;
                clienteExistente.Apellido = clienteDto.Apellido;
                clienteExistente.RazonSocial = clienteDto.RazonSocial;
                clienteExistente.Cuit = clienteDto.Cuit;
                clienteExistente.FechaNacimiento = DateTime.Parse(clienteDto.FechaNacimiento);
                clienteExistente.TelefonoCelular = clienteDto.TelefonoCelular;
                clienteExistente.Email = clienteDto.Email;
                clienteExistente.FechaModificacion = DateTime.Now;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, $"Error de concurrencia al actualizar cliente {id}.");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al actualizar el cliente {id}.");
                return StatusCode(500, "Error interno al actualizar.");
            }
        }

        /// <summary>
        /// Elimina un cliente por su ID.
        /// </summary>
        /// <param name="id">ID del cliente a eliminar.</param>
        /// <response code="204">Eliminación exitosa</response>
        /// <response code="404">Si el cliente no existe</response>
        [HttpDelete("Delete/{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            try
            {
                var cliente = await _context.Clientes.FindAsync(id);
                if (cliente == null)
                {
                    return NotFound();
                }

                _context.Clientes.Remove(cliente);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al eliminar el cliente {id}.");
                return StatusCode(500, "Error interno al eliminar.");
            }
        }
    }
}