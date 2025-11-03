using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.DTOs.RequestModels
{
    public class ResetPasswordRequest
    {
        // Token sent in the email link
        public string Token { get; set; } = string.Empty;

        // New password user wants to set
        public string NewPassword { get; set; } = string.Empty;
    }
}
