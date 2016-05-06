namespace FirstApp.ModelLibrary
{
    public class LoginModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class ResponseModel
    {
        public ResponseModel(int status, string statusMessage)
        {
            Status = status;
            StatusMessage = statusMessage;
        }

        public ResponseModel()
        {
            
        }

        public int Status { get; set; }
        public string StatusMessage { get; set; }
        
    }

    public class ResponseModel<T>: ResponseModel
    {
        public T Data { get; set; }

        public ResponseModel(int status, string statusMessage,T data) : base(status, statusMessage)
        {
            Data = data;
        }

        public ResponseModel(T data) : base(0, "Success.OK")
        {
            Data = data;
        }

        public ResponseModel()
        {
            
        }
    }

}
