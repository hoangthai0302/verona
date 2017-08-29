using System;
using System.ComponentModel.DataAnnotations;

namespace Verona.WebUI.Models
{
    public class JobTypeDetail
    {
        public long JobTypeCode { get; set; }

        [Range(0, 9, ErrorMessage = "Priority is incorrect")]
        public short Priority { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "SlaTime is incorrect")]
        public int SlaTime { get; set; }

        public DateTime LastUpdated { get; set; }

        [Required(ErrorMessage = "UpdatedBy can not be empty")]
        [StringLength(50, ErrorMessage = "UpdatedBy more than 50 characters")]
        public string UpdatedBy { get; set; }
    }
}