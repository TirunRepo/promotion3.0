using FluentValidation;
using MarketPlace.Common.DTOs.RequestModels.Promotions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.Validator
{
    public class PromotionCalculationValidator : AbstractValidator<PromotionCalculationRequest>
    {
        public PromotionCalculationValidator()
        {
            RuleFor(x => x.BaseFare).GreaterThan(0);
            RuleFor(x => x.Passengers).NotEmpty().WithMessage("At least one passenger is required.");
            RuleForEach(x => x.Passengers).SetValidator(new PassengerValidator());
            RuleFor(x => x.BookingDate).NotEmpty();
        }
    }

    public class PassengerValidator : AbstractValidator<PassengerRequestModel>
    {
        public PassengerValidator()
        {
            RuleFor(x => x.Gender).NotEmpty();
            RuleFor(x => x.Age).GreaterThanOrEqualTo(0);
        }
    }
}
