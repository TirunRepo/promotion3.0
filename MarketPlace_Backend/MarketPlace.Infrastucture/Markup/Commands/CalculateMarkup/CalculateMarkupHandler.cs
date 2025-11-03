using MarketPlace.Common.DTOs.ResponseModels.Markup;
using MarketPlace.DataAccess.Entities.Markup;
using MarketPlace.DataAccess.Repositories.Markup.Interface;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Infrastucture.Markup.Commands.CalculateMarkup
{
    public class CalculateMarkupHandler 
    {
        private readonly IMarkupRepository _service;

        public CalculateMarkupHandler(IMarkupRepository service)
        {
            _service = service;
        }

/*        public async Task<MarkupCalculationResponse> Handle(CalculateMarkupCommand request, CancellationToken cancellationToken)
        {
            var markupDetails = await _service.GetMarkupDetails();

            //var applicableMarkup = markupDetails.Where(x => x.IsActive
            //                        && (x.SupplierId == null || x.SupplierId == request.MarkupCalculationRequest.SupplierId)
            //                        && (x.SailingId == null || x.SailingId == request.MarkupCalculationRequest.SailingId)
            //                        && (x.StartDate.Date <= request.MarkupCalculationRequest.BookingDate
            //                        && x.EndDate.Date >= request.MarkupCalculationRequest.BookingDate)
            //                        && (x.MinBaseFare == null || x.MinBaseFare <= request.MarkupCalculationRequest.BaseFare)
            //                        && (x.MaxBaseFare == null || x.MaxBaseFare >= request.MarkupCalculationRequest.BaseFare)).FirstOrDefault();

            MarkupCalculationResponse markupCalculationResponse = new MarkupCalculationResponse();

            if (applicableMarkup != null)
            {
                markupCalculationResponse.Id = applicableMarkup.Id;
                markupCalculationResponse.TotalBaseFare = request.MarkupCalculationRequest.BaseFare;
                markupCalculationResponse.TotalMarkup = CalculateMarkup(request.MarkupCalculationRequest.BaseFare, applicableMarkup);
                markupCalculationResponse.TotalFare = markupCalculationResponse.TotalBaseFare + markupCalculationResponse.TotalMarkup;
            }

            return markupCalculationResponse;
        }

        private static decimal CalculateMarkup(decimal baseFare, MarkupDetail applicableMarkup)
        {
            decimal markUp = 0;
            if (applicableMarkup.MarkupPercentage > 0)
            {
                markUp = (baseFare * applicableMarkup.MarkupPercentage ?? 0) / 100;
            }
            if (markUp > 0 && applicableMarkup.MaxMarkup > 0 && applicableMarkup.MaxMarkup < markUp)
            {
                markUp = applicableMarkup.MaxMarkup ?? 0;
            }
            else if (markUp == 0)
            {
                markUp = applicableMarkup.MinMarkup ?? 0;
            }
            return markUp;
        }
    */
    }
}
