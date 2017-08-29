using System.Configuration;

namespace Verona.WebUI.Configuration
{
    public class AppSetting
    {
        public static readonly string VeronaUrlApi = ConfigurationManager.AppSettings["Verona.Url.API"];
    }
}