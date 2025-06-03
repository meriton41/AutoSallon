namespace AutoSallonSolution.Models
{
    public class CarInsurance
    {
            public Guid Id { get; set; }
            public string PolicyNumber { get; set; }
            public string CarId { get; set; }
            public string ClientName { get; set; }
            public string ClientEmail { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
            public string CoverageDetails { get; set; }
            public decimal Price { get; set; }
        }
    }

