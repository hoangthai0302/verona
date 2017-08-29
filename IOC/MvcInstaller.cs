// -----------------------------------------------------------------------
//  <copyright file="MvcInstaller.cs" company="Imperial Civil Enforcement Solutions">
//      Copyright(c) Imperial Civil Enforcement Solutions. All rights reserved.
//      Module     : MvcInstaller.cs
//      Author     : Andy Garner
//      Date       : 11/11/2014 13:49
//      Description: Windsor installer for MVC related entities.
//  </copyright>
// -----------------------------------------------------------------------

using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;
using Verona.WebUI.Controllers;

namespace Verona.WebUI.IOC
{
    /// <summary>
    ///     Windsor installer for MVC related entities.
    /// </summary>
    public class MvcInstaller : IWindsorInstaller
    {
        /// <summary>
        ///     Installs Web Api related entities enabling dependency injection into MVC controllers.
        /// </summary>
        /// <param name="container">Windsor container.</param>
        /// <param name="store">Configuration store.</param>
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            var controllers = Assembly.GetExecutingAssembly().GetTypes()
                .Where(x => x.BaseType == typeof(BaseController)).ToList();
            //var controllerBases = Assembly.GetExecutingAssembly().GetTypes().Where(x => x.BaseType == typeof(BaseController)).ToList();
            foreach (var controller in controllers)
                container.Register(Component.For(controller).LifestylePerWebRequest());

            container.Register(
                Classes.FromAssemblyNamed("Elmah.Mvc")
                    .BasedOn<IController>()
                    .LifestyleTransient());

            var castleControllerFactory = new CastleControllerFactory(container);
            ControllerBuilder.Current.SetControllerFactory(castleControllerFactory);
        }
    }
}