using System.Linq;
using System.Web.Mvc;

namespace Verona.WebUI.Controllers
{
    public class BaseController : Controller
    {
        public string ModelStateError()
        {
            var strError = string.Empty;
            foreach (var error in ModelState.Values.SelectMany(modelState => modelState.Errors))
            {
                if (!string.IsNullOrEmpty(error.ErrorMessage))
                    strError = error.ErrorMessage;
                if (error.Exception != null)
                    strError = error.Exception.Message;
                break;
            }
            return strError;
        }
    }
}