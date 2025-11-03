using MarketPlace.Business.Services.Interface.Promotions;
using MediatR;

namespace MarketPlace.Infrastucture.Promotion.Commands.DeletePromotion
{
    public class DeletePromotionHandler : IRequestHandler<DeletePromotionCommand, bool>
    {
        private readonly IPromotionService _service;

        public DeletePromotionHandler(IPromotionService service)
        {
            _service = service;
        }

        public async Task<bool> Handle(DeletePromotionCommand request, CancellationToken cancellationToken)
        {
            await _service.DeleteAsync(request.Id);
            return true;
        }
    }

}
