namespace MarketPlace.Common.APIResponse
{
    public class APIResponse<T>
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }

        public APIResponse() { }

        public APIResponse(T data, string? message = null)
        {
            Success = true;
            Data = data;
            Message = message;
        }

        public APIResponse(string message)
        {
            Success = false;
            Message = message;
        }

        public static APIResponse<T> Ok(T data, string? message = null)
        {
            return new APIResponse<T>(data, message);
        }

        public static APIResponse<T> Fail(string message)
        {
            return new APIResponse<T>(message) { Success = false };
        }
    }
}
