using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace AutoSallonSolution.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendVerificationEmailAsync(string toEmail, string encodedToken)
        {
            try
            {
                Console.WriteLine("📧 Starting to send verification email to: " + toEmail);

                var smtpSettings = _config.GetSection("SmtpSettings");
                var fromAddress = smtpSettings["UserName"];
                var password = smtpSettings["Password"];
                var host = smtpSettings["Host"];
                var port = int.Parse(smtpSettings["Port"]);
                var enableSsl = bool.Parse(smtpSettings["EnableSsl"]);

                if (string.IsNullOrEmpty(fromAddress) || string.IsNullOrEmpty(password))
                {
                    Console.WriteLine("❌ Email configuration is missing");
                    throw new Exception("Email configuration is incomplete");
                }

                var verifyUrl = $"http://localhost:3000/verify-email?token={encodedToken}";
                Console.WriteLine("🔗 Verification URL: " + verifyUrl);

                var message = new MailMessage(fromAddress, toEmail)
                {
                    Subject = "Verify your email",
                    Body = $@"
                        <h2>Verify Your Email</h2>
                        <p>Click the link below to verify your account:</p>
                        <p><a href=""{verifyUrl}"">{verifyUrl}</a></p>",
                    IsBodyHtml = true
                };

                using var smtp = new SmtpClient(host, port)
                {
                    EnableSsl = enableSsl,
                    Credentials = new NetworkCredential(fromAddress, password)
                };

                Console.WriteLine("📤 Sending email...");
                await smtp.SendMailAsync(message);
                Console.WriteLine("✅ Email sent successfully to: " + toEmail);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Failed to send email: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw; // Re-throw to be handled by the caller
            }
        }
    }
}
