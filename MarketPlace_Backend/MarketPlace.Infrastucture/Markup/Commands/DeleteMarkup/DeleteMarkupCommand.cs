using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Infrastucture.Markup.Commands.DeleteMarkup
{
    public class DeleteMarkupCommand : IRequest<bool>
    {
        public int Id { get; set; }

        public DeleteMarkupCommand(int id)
        {
            Id = id;
        }
    }
}
