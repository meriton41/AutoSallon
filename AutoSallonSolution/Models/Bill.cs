using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoSallonSolution.Models
{
    public class Bill
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Client name is required")]
        public string ClientName { get; set; }

        [Required(ErrorMessage = "Client email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string ClientEmail { get; set; }
        
        [Required(ErrorMessage = "Vehicle ID is required")]
        public int VehicleId { get; set; }
        
        [ForeignKey("VehicleId")]
        public Vehicle Vehicle { get; set; }
        
        [Required(ErrorMessage = "Amount is required")]
        [Column(TypeName = "decimal(18,2)")]
        [Range(0, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Date is required")]
        public DateTime Date { get; set; }
    }
}
