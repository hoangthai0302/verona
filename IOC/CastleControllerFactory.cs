// -----------------------------------------------------------------------
//  <copyright file="CastleControllerFactory.cs" company="Imperial Civil Enforcement Solutions">
//      Copyright(c) Imperial Civil Enforcement Solutions. All rights reserved.
//      Module     : CastleControllerFactory.cs
//      Author     : Andy Garner
//      Date       : 11/11/2014 13:45
//      Description: Controller Factory used for MVC which uses Castle Windsor.
//  </copyright>
// -----------------------------------------------------------------------

using Castle.Windsor;
using System;
using System.Web.Mvc;
using System.Web.Routing;

namespace Verona.WebUI.IOC
{
    /// <summary>
    ///     Controller Factory used for MVC which uses Castle Windsor.
    /// </summary>
    public class CastleControllerFactory : DefaultControllerFactory
    {
        /// <summary>
        ///     Initializes a new instance of the  class.
        /// </summary>
        /// <param name="container">The container used to resolve the MVC controllers.</param>
        /// <exception cref="System.ArgumentNullException">Windsor container.</exception>
        public CastleControllerFactory(IWindsorContainer container)
        {
            Container = container ?? throw new ArgumentNullException(nameof(container));
        }

        /// <summary>
        ///     Gets or sets the container.
        /// </summary>
        public IWindsorContainer Container { get; protected set; }

        /// <summary>
        ///     Releases the specified controller.
        /// </summary>
        /// <param name="controller">The controller to release.</param>
        public override void ReleaseController(IController controller)
        {
            // If controller implements IDisposable, clean it up responsibly
            var disposableController = controller as IDisposable;
            disposableController?.Dispose();

            // Inform Castle that the controller is no longer required
            Container.Release(controller);
        }

        /// <summary>
        ///     Retrieves the controller instance for the specified request context and controller type.
        /// </summary>
        /// <param name="requestContext">The context of the HTTP request, which includes the HTTP context and route data.</param>
        /// <param name="controllerType">The type of the controller.</param>
        /// <returns>
        ///     The controller instance.
        /// </returns>
        protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
        {
            if (controllerType == null)
                return null;

            // Retrieve the requested controller from Castle
            return Container.Resolve(controllerType) as IController;
        }
    }
}