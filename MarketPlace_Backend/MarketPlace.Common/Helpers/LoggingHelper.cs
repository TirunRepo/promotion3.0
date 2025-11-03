using Microsoft.Extensions.Logging;

namespace Promotion.Common.Helpers
{
    public class LoggingHelper<T>
    {
        private readonly ILogger<T> _logger;

        public LoggingHelper(ILogger<T> logger)
        {
            _logger = logger;
        }

        public void LogInfo(string message)
        {
            _logger.LogInformation(message);
        }

        public void LogError(string message, Exception ex = null)
        {
            _logger.LogError(ex, message);
        }

        public void LogWarning(string message)
        {
            _logger.LogWarning(message);
        }
    }
}
