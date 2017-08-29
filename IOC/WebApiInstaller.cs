// -----------------------------------------------------------------------
//  <copyright file="WebApiInstaller.cs" company="Imperial Civil Enforcement Solutions">
//      Copyright(c) Imperial Civil Enforcement Solutions. All rights reserved.
//      Module     : WebApiInstaller.cs
//      Author     : Andy Garner
//      Date       : 11/11/2014 13:50
//      Description: Windsor installer for Web Api related entities.
//  </copyright>
// -----------------------------------------------------------------------

using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using System.Web.Http;

namespace Verona.WebUI.IOC
{
    /// <summary>
    ///     Windsor installer for Web Api related entities.
    /// </summary>
    public class WebApiInstaller : IWindsorInstaller
    {
        /// <summary>
        ///     Installs Web Api related entities enabling dependency injection into Web Api controllers.
        /// </summary>
        /// <param name="container">Windsor container.</param>
        /// <param name="store">Configuration store.</param>
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(Classes.FromThisAssembly()
                .BasedOn<ApiController>()
                .LifestyleScoped());

            GlobalConfiguration.Configuration.DependencyResolver = new CastleDependencyResolver(container);
        }
    }
}