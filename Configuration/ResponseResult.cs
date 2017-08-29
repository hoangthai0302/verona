namespace Verona.WebUI.Configuration
{
    public class ResponseResult
    {
        public ResponseResult(int status, string message, object data)
        {
            Status = status;
            Message = message;
            Data = data;
        }

        public ResponseResult(int status, string message)
        {
            Status = status;
            Message = message;
        }

        public int Status { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
    }
}