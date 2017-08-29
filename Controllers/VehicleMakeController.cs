using System;
using System.Web.Mvc;
using Verona.Common.Request;
using Verona.Common.Response;
using Verona.Common.Wcf;
using Verona.Entity;
using Verona.WebUI.Configuration;

namespace Verona.WebUI.Controllers
{
    public class VehicleMakeController : BaseController
    {
        private readonly IRequestProcessorService _requestProcessor;

        public VehicleMakeController(IRequestProcessorService requestProcessor)
        {
            _requestProcessor = requestProcessor;
        }

        /// <summary>
        /// Get all in table VehicleMake
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetAllVehicleMake()
        {
            try
            {
                var response = _requestProcessor.Process(new VehicleMakeGetAllRequest()) as VehicleMakeGetAllResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message, response.VehicleMakeList), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }
    }
}