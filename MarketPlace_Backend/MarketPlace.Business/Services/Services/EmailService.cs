using MarketPlace.Business.Services.Interface;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace MarketPlace.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var smtpConfig = _config.GetSection("Frontend:Smtp");
            using (var client = new SmtpClient(smtpConfig["Host"], int.Parse(smtpConfig["Port"])))
            {
                client.EnableSsl = true;
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(smtpConfig["Username"], smtpConfig["Password"]);

                var mail = new MailMessage
                {
                    From = new MailAddress(smtpConfig["Username"], "Marketplace Support"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true,
                };
                mail.To.Add(to);

                await client.SendMailAsync(mail);
            }
        }
    }
}
