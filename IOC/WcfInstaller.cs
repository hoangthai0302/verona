// -----------------------------------------------------------------------
//  <copyright file="WcfInstaller.cs" company="Imperial Civil Enforcement Solutions">
//      Copyright(c) Imperial Civil Enforcement Solutions. All rights reserved.
//      Module     : WcfInstaller.cs
//      Author     : Andy Garner
//      Date       : 11/11/2014 10:01
//      Description: Windsor installer for WCF related entities.
//  </copyright>
// -----------------------------------------------------------------------

using Castle.Facilities.WcfIntegration;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using System;
using System.ServiceModel;
using Verona.Common.Wcf;
using Verona.WebUI.Configuration;

namespace Verona.WebUI.IOC
{
    /// <summary>
    ///     Windsor installer for WCF related entities.
    /// </summary>
    public class WcfInstaller : IWindsorInstaller
    {
        /// <summary>
        ///     Installs WCF related entities enabling dependency injection for the WCF service.
        /// </summary>
        /// <param name="container">Windsor container.</param>
        /// <param name="store">Configuration store.</param>
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.AddFacility<WcfFacility>(f => { f.CloseTimeout = TimeSpan.Zero; });
            //if (Config.RequireHttps)
            //{
            //    var binding = new BasicHttpsBinding
            //    {
            //        CloseTimeout = TimeSpan.FromMinutes(5),
            //        MaxReceivedMessageSize = int.MaxValue,
            //        MaxBufferPoolSize = int.MaxValue,
            //        OpenTimeout = TimeSpan.FromMinutes(60),
            //        ReceiveTimeout = TimeSpan.FromMinutes(60),
            //        SendTimeout = TimeSpan.FromMinutes(60)
            //    };
            //    var serviceLayerUrl = ConfigurationManager.AppSettings["serviceLayerUrl"];
            //    container.Register(
            //        Component.For<IRequestProcessorService>()
            //            .AsWcfClient(
            //                new DefaultClientModel(
            //                    WcfEndpoint.BoundTo(binding)
            //                        .At(serviceLayerUrl + "/RequestProcessorService.svc"))));
            //}
            //else
            //{
            var binding = new BasicHttpBinding
            {
                CloseTimeout = TimeSpan.FromMinutes(5),
                MaxReceivedMessageSize = int.MaxValue,
                MaxBufferPoolSize = int.MaxValue,
                OpenTimeout = TimeSpan.FromMinutes(60),
                ReceiveTimeout = TimeSpan.FromMinutes(60),
                SendTimeout = TimeSpan.FromMinutes(60)
            };
            container.Register(Component.For<IRequestProcessorService>().AsWcfClient(
                new DefaultClientModel(WcfEndpoint.BoundTo(binding).At(AppSetting.VeronaUrlApi + "/RequestProcessorService.svc")))
            );
            //}
        }
    }
}