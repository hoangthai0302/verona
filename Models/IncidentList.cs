using System;
using System.ComponentModel.DataAnnotations;

namespace Verona.WebUI.Models
{
    public class IncidentList
    {
        public long IncidentNumber { get; set; }

        [Required(ErrorMessage = "Incident type can not be empty")]
        public long IncidentType { get; set; }

        [Required(ErrorMessage = "VRM can not be empty")]
        [StringLength(50, ErrorMessage = "VRM more than 50 characters")]
        public string Vrm { get; set; }

        public long? VehicleMake { get; set; }

        public long? VehicleColour { get; set; }

        [Required(ErrorMessage = "Location can not be empty")]
        [StringLength(500, ErrorMessage = "Location more than 500 characters")]
        public string Location { get; set; }

        [Range(0, 999.999999999)]
        public decimal? Latitude { get; set; }

        [Range(0, 999.999999999)]
        public decimal? Longitude { get; set; }

        public long? Ceo { get; set; }

        [Required(ErrorMessage = "Time Reported can not be empty")]
        public DateTime TimeReported { get; set; }

        [Required(ErrorMessage = "Updated by can not be empty")]
        [StringLength(50, ErrorMessage = "Updated by more than 500 characters")]
        public string UpdatedBy { get; set; } = "admin";

        public DateTime LastUpdated { get; set; } = DateTime.Now;

        public long? JobNumber { get; set; }

        [StringLength(10)]
        public string JobStatus { get; set; }

        public bool? IsClose { get; set; }

        [StringLength(500, ErrorMessage = "Notes more than 500 characters")]
        public string Notes { get; set; }
    }
}