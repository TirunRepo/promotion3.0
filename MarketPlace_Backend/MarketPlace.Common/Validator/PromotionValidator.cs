using FluentValidation;
using MarketPlace.Common.DTOs.RequestModels.Promotions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.Validator
{
    public class PromotionValidator : AbstractValidator<PromotionRequest>
    {
        public PromotionValidator()
        {
            RuleFor(x => x.PromotionName).NotEmpty();
            RuleFor(x => x.StartDate).LessThan(x => x.EndDate);
        }
    }
}
