using System;
using System.ComponentModel.DataAnnotations;

namespace Verona.WebUI.Models
{
    public class RejectionReason
    {
        public long ReasonNumber { get; set; }

        [Required(ErrorMessage = "Description can not be empty")]
        [StringLength(500, ErrorMessage = "Description more than 500 characters")]
        public string Description { get; set; }

        public bool IsInactive { get; set; }

        public DateTime LastUpdated { get; set; }

        [Required(ErrorMessage = "UpdatedBy can not be empty")]
        [StringLength(500, ErrorMessage = "UpdatedBy more than 500 characters")]
        public string UpdatedBy { get; set; }
    }
}