using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChallengeIntuit.Backend.Models
{
    [Table("clientes")]
    public class Cliente
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nombre")]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Column("apellido")]
        [StringLength(100)]
        public string Apellido { get; set; } = string.Empty;

        [Column("razon_social")]
        [StringLength(150)]
        public string RazonSocial { get; set; } = string.Empty;

        [Column("cuit")]
        [StringLength(20)]
        public string Cuit { get; set; } = string.Empty;

        [Column("fecha_nacimiento")]
        [DataType(DataType.Date)]
        public DateTime FechaNacimiento { get; set; }

        [Column("telefono_celular")]
        [StringLength(30)]
        public string TelefonoCelular { get; set; } = string.Empty;

        [Column("email")]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [Column("fecha_creacion")]
        public DateTime FechaCreacion { get; set; }

        [Column("fecha_modificacion")]
        public DateTime FechaModificacion { get; set; }
    }
}
