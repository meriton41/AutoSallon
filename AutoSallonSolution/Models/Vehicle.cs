using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoSallonSolution.Models
{
    public class Vehicle
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Image { get; set; }
        public int Year { get; set; }
        public string Mileage { get; set; }
        public string Brand { get; set; }
        public string BrandLogo { get; set; }
       
        public string Engine { get; set; }
        public string Fuel { get; set; }
        public string Power { get; set; }
        public string Description { get; set; }
        public string Transmission { get; set; }
        public string Color { get; set; }
        public string InteriorColor { get; set; }
       
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
    }
} 