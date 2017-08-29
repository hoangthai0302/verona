// -----------------------------------------------------------------------
//  <copyright file="Container.cs" company="Imperial Civil Enforcement Solutions">
//      Copyright(c) Imperial Civil Enforcement Solutions. All rights reserved.
//      Module     : Container.cs
//      Author     : Andy Garner
//      Date       : 11/11/2014 09:56
//      Description: Static class for initialising the IoC container.
//  </copyright>
// -----------------------------------------------------------------------

using Castle.Windsor;

namespace Verona.WebUI.IOC
{
    /// <summary>
    ///     Static class for initialising the IoC container.
    /// </summary>
    public static class Container
    {
        /// <summary>
        ///     Static instance of a Windsor container.
        /// </summary>
        private static IWindsorContainer _container;

        /// <summary>
        ///     Initialises the container. Can be called multiple times.
        /// </summary>
        public static void Initialise()
        {
            if (_container == null)
            {
                _container = new WindsorContainer();
                _container.Install(
                    new WcfInstaller(),
                    new WebApiInstaller(),
                    new MvcInstaller());
            }
        }
    }
}