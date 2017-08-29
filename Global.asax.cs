using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Verona.Common.Wcf;
using Verona.WebUI.IOC;

namespace Verona.WebUI
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            Container.Initialise();

            KnownTypeProvider.Initialise();

            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}