using System.ComponentModel.DataAnnotations;

namespace ChallengeIntuit.Backend.Models
{
    public class ClienteDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El apellido es obligatorio.")]
        public string Apellido { get; set; } = string.Empty;

        [Required(ErrorMessage = "La razón social es obligatoria.")]
        public string RazonSocial { get; set; } = string.Empty;

        [Required(ErrorMessage = "El CUIT es obligatorio.")]
        [RegularExpression(@"^\d{2}-\d{8}-\d{1}$", ErrorMessage = "El formato del CUIT no es válido. Debe ser XX-XXXXXXXX-X")]
        public string Cuit { get; set; } = string.Empty;

        [Required(ErrorMessage = "La fecha de nacimiento es obligatoria.")]
        [RegularExpression(@"^\d{4}-\d{2}-\d{2}$", ErrorMessage = "El formato de la fecha no es válido. Debe ser AAAA-MM-DD")]
        public string FechaNacimiento { get; set; } = string.Empty;

        [Required(ErrorMessage = "El teléfono celular es obligatorio.")]
        public string TelefonoCelular { get; set; } = string.Empty;

        [Required(ErrorMessage = "El email es obligatorio.")]
        [EmailAddress(ErrorMessage = "El formato del email no es válido.")]
        public string Email { get; set; } = string.Empty;
    }
}