public class Bill
{
    public Guid Id { get; set; }
    public string ClientName { get; set; }
    public string ClientEmail { get; set; }
    public string CarId { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
}
