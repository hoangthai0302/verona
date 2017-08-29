// -----------------------------------------------------------------------
//  <copyright file="CastleDependencyScope.cs" company="Imperial Civil Enforcement Solutions">
//      Copyright(c) Imperial Civil Enforcement Solutions. All rights reserved.
//      Module     : CastleDependencyScope.cs
//      Author     : Andy Garner
//      Date       : 11/11/2014 11:29
//      Description: Dependency scope using Castle Windsor.
//  </copyright>
// -----------------------------------------------------------------------

using Castle.MicroKernel;
using Castle.MicroKernel.Lifestyle;
using Castle.Windsor;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web.Http.Dependencies;

namespace Verona.WebUI.IOC
{
    /// <summary>
    ///     Dependency scope using Castle Windsor.
    /// </summary>
    [DebuggerStepThrough]
    public class CastleDependencyScope : IDependencyScope
    {
        /// <summary>
        ///     Indicates whether or not the class has previously been disposed.
        /// </summary>
        private bool _disposed;

        /// <summary>
        ///     The scope of the components being resolved.
        /// </summary>
        /// <remarks>
        ///     This scope variable contains the castle scope object created when
        ///     resolving the component with castle.
        /// </remarks>
        private IDisposable _scope;

        /// <summary>
        ///     Initializes a new instance of the <see cref="CastleDependencyScope" /> class.
        /// </summary>
        /// <param name="container">The castle container used to resolve components.</param>
        /// <exception cref="System.ArgumentNullException">Castle container.</exception>
        public CastleDependencyScope(IWindsorContainer container)
        {
            Container = container ?? throw new ArgumentNullException(nameof(container));
            _scope = Container.BeginScope();
        }

        /// <summary>
        ///     Gets or sets container used to resolve components.
        /// </summary>
        public IWindsorContainer Container { get; protected set; }

        /// <summary>
        ///     Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        ///     Resolves a component from the Castle container.
        /// </summary>
        /// <param name="serviceType">The type of the component to be resolved.</param>
        /// <returns>
        ///     The resolved component; otherwise <c>null</c> if no component could be resolved.
        /// </returns>
        public object GetService(Type serviceType)
        {
            try
            {
                return Container.Resolve(serviceType);
            }
            catch (ComponentNotFoundException)
            {
                return null;
            }
        }

        /// <summary>
        ///     Resolves a collection components from the Castle container.
        /// </summary>
        /// <param name="serviceType">The type of the component to be resolved.</param>
        /// <returns>
        ///     A list of the resolved components; otherwise <c>new List()</c> if no components could be resolved.
        /// </returns>
        public IEnumerable<object> GetServices(Type serviceType)
        {
            // Not expected to throw an exception, rather return an empty IEnumerable.
            return Container.ResolveAll(serviceType).Cast<object>();
        }

        /// <summary>
        ///     Finalizes an instance of the <see cref="CastleDependencyScope" /> class.
        /// </summary>
        ~CastleDependencyScope()
        {
            Dispose(false);
        }

        /// <summary>
        ///     Releases unmanaged and - optionally - managed resources.
        /// </summary>
        /// <param name="disposing">
        ///     <c>true</c> to release both managed and unmanaged resources; <c>false</c> to release only unmanaged resources.
        /// </param>
        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                    if (_scope != null)
                    {
                        _scope.Dispose();
                        _scope = null;
                    }

                // Cleanup any unmanaged resources here, if necessary.
                _disposed = true;
            }

            // Call the base class's Dispose(Boolean) method, if available.
            // base.Dispose( disposing );
        }
    }
}