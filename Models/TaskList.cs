using System.ComponentModel.DataAnnotations;

namespace Verona.WebUI.Models
{
    public class TaskList
    {
        public long TaskId { get; set; }

        public long JobTypeCode { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "StepNumber must be greater than 0")]
        public int StepNumber { get; set; }

        [Required(ErrorMessage = "Description can not be empty")]
        [StringLength(500, ErrorMessage = "Description more than 500 characters")]
        public string TaskDescription { get; set; }

        public bool IsRequired { get; set; }

        public int? DependsOn { get; set; }
    }
}