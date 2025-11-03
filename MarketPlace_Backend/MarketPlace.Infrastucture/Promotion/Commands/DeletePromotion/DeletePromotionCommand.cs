using MediatR;

public class DeletePromotionCommand : IRequest<bool>
{
    public int Id { get; set; }

    public DeletePromotionCommand(int id)
    {
        Id = id;
    }
}
