using System.Web.Mvc;

namespace Verona.WebUI.Controllers
{
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            return Redirect("~/index.html");
        }
    }
}