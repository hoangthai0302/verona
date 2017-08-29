using System;
using System.Web.Mvc;
using Verona.Common.Request;
using Verona.Common.Response;
using Verona.Common.Wcf;
using Verona.Entity;
using Verona.WebUI.Configuration;
using Verona.WebUI.Models;

namespace Verona.WebUI.Controllers
{
    public class RejectionReasonController : BaseController
    {
        private readonly IRequestProcessorService _requestProcessor;

        public RejectionReasonController(IRequestProcessorService requestProcessor)
        {
            _requestProcessor = requestProcessor;
        }

        /// <summary>
        /// RejectionReason Paging
        /// </summary>
        /// <param name="pagingSortModel"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult RejectionReasonPaging(PagingSortModel pagingSortModel)
        {
            try
            {
                if (!string.IsNullOrEmpty(pagingSortModel.SortColumn) && !QueryHelper.PropertyExists<Entity.Models.RejectionReason>(pagingSortModel.SortColumn))
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "SortColumn parameter values do not exist in the list of columns"), JsonRequestBehavior.AllowGet);

                var response = _requestProcessor.Process(new RejectionReasonPagingRequest
                {
                    PagingSort = pagingSortModel
                }) as RejectionReasonPagingResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message, response.TupleRejectionReason), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Insert RejectionReason
        /// </summary>
        /// <param name="rejectionReason"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult RejectionReasonInsert(RejectionReason rejectionReason)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ModelStateError()));

                var rejectionReasonModel = new Entity.Models.RejectionReason
                {
                    Description = rejectionReason.Description,
                    IsInactive = false,
                    LastUpdated = DateTime.Now,
                    UpdatedBy = rejectionReason.UpdatedBy
                };
                var response = _requestProcessor.Process(new RejectionReasonInsertRequest
                {
                    RejectionReasonModel = rejectionReasonModel
                }) as RejectionReasonInsertResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message, response.ReasonNumber))
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."));
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message));
            }
        }

        /// <summary>
        /// Update RejectionReason
        /// </summary>
        /// <param name="rejectionReason"></param>
        /// <returns></returns>
        [HttpPut]
        public JsonResult RejectionReasonUpdate(RejectionReason rejectionReason)
        {
            try
            {
                if (rejectionReason.ReasonNumber == 0)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "ReasonNumber is incorrect"));

                if (!ModelState.IsValid)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ModelStateError()));

                var rejectionReasonModel = new Entity.Models.RejectionReason
                {
                    ReasonNumber = rejectionReason.ReasonNumber,
                    Description = rejectionReason.Description,
                    IsInactive = false,
                    LastUpdated = DateTime.Now,
                    UpdatedBy = rejectionReason.UpdatedBy
                };
                var response = _requestProcessor.Process(new RejectionReasonUpdateRequest
                {
                    RejectionReasonModel = rejectionReasonModel
                }) as RejectionReasonUpdateResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message))
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."));
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message));
            }
        }

        /// <summary>
        /// Delete RejectionReason
        /// </summary>
        /// <param name="reasonNumber"></param>
        /// <returns></returns>
        [HttpDelete]
        public JsonResult RejectionReasonDelete(long reasonNumber)
        {
            try
            {
                if (reasonNumber == 0)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "ReasonNumber is incorrect"));
                
                var response = _requestProcessor.Process(new RejectionReasonDeleteRequest
                {
                    ReasonNumber = reasonNumber
                }) as RejectionReasonDeleteResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message))
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."));
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message));
            }
        }

        /// <summary>
        /// RejectionReason All
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult RejectionReasongetAll()
        {
            try
            {
                var response = _requestProcessor.Process(new RejectionReasonGetAllRequest()) as RejectionReasonGetAllResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message, response.RejectionReasons), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }
    }
}