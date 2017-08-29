using System;
using System.ComponentModel.DataAnnotations;

namespace Verona.WebUI.Models
{
    public class JobQueueUpdate
    {
        public long JobNumber { get; set; }

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

        public DateTime? SlaDateTime { get; set; }

        public long Ceo { get; set; }

        public short? Priority { get; set; }

        [StringLength(500, ErrorMessage = "Notes more than 500 characters")]
        public string Notes { get; set; }

        public DateTime LastUpdated { get; set; }

        [Required(ErrorMessage = "Updated by can not be empty")]
        [StringLength(50, ErrorMessage = "Updated by more than 500 characters")]
        public string UpdatedBy { get; set; }
    }

    public class JobQueueCancel
    {
        [Range(1, long.MaxValue, ErrorMessage = "JobNumber is incorrect")]
        public long JobNumber { get; set; }

        [Required(ErrorMessage = "You need to enter a cancellation reason")]
        [StringLength(500, ErrorMessage = "Notes more than 500 characters")]
        public string Notes { get; set; }

        [Required(ErrorMessage = "Updated by can not be empty")]
        [StringLength(50, ErrorMessage = "Updated by more than 500 characters")]
        public string UpdatedBy { get; set; }
    }

    public class JobQueueReject
    {
        [Range(1, long.MaxValue, ErrorMessage = "JobNumber is incorrect")]
        public long JobNumber { get; set; }

        [Range(1, long.MaxValue, ErrorMessage = "You need to choose a rejection reason")]
        public long ReasonNumber { get; set; }

        [Required(ErrorMessage = "Updated by can not be empty")]
        [StringLength(50, ErrorMessage = "Updated by more than 500 characters")]
        public string UpdatedBy { get; set; }
    }

    public class JobQueueCompleted
    {
        [Range(1, long.MaxValue, ErrorMessage = "JobNumber is incorrect")]
        public long JobNumber { get; set; }

        [Required(ErrorMessage = "You need to enter a reason")]
        [StringLength(500, ErrorMessage = "Notes more than 500 characters")]
        public string Notes { get; set; }

        [Required(ErrorMessage = "Updated by can not be empty")]
        [StringLength(50, ErrorMessage = "Updated by more than 500 characters")]
        public string UpdatedBy { get; set; }
    }
}