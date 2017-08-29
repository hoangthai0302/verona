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
    public class JobTypeDetailController : BaseController
    {
        private readonly IRequestProcessorService _requestProcessor;

        public JobTypeDetailController(IRequestProcessorService requestProcessor)
        {
            _requestProcessor = requestProcessor;
        }

        /// <summary>
        /// Get all in table JobTypeDetail
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetAllJobTypeDetail()
        {
            try
            {
                var response = _requestProcessor.Process(new JobTypeDetailGetAllRequest()) as JobTypeDetailGetAllResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message, response.JobTypeDetailList), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// JobTypeDetail Paging
        /// </summary>
        /// <param name="pagingSortModel"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult JobTypeDetailPaging(PagingSortModel pagingSortModel)
        {
            try
            {
                if (!string.IsNullOrEmpty(pagingSortModel.SortColumn) && !QueryHelper.PropertyExists<JobQueueListModel>(pagingSortModel.SortColumn))
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "SortColumn parameter values do not exist in the list of columns"), JsonRequestBehavior.AllowGet);

                var response = _requestProcessor.Process(new JobTypeDetailPagingRequest
                {
                    PagingSort = pagingSortModel
                }) as JobTypeDetailPagingResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message, response.TupleJobTypeDetai), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Get JobTypeDetail by JobTypeCode
        /// </summary>
        /// <param name="jobTypeCode"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult JobTypeDetailGetByCode(long jobTypeCode)
        {
            try
            {
                if (jobTypeCode == 0)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "JobTypeCode is incorrect"), JsonRequestBehavior.AllowGet);

                var response = _requestProcessor.Process(new JobTypeDetailGetByCodeRequest { JobTypeCode = jobTypeCode }) as JobTypeDetailGetByCodeResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message, response.JobTypeDetail), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Update Priority and SlaTime in table JobTypeDetail
        /// </summary>
        /// <param name="jobTypeDetail"></param>
        /// <returns></returns>
        [HttpPut]
        public JsonResult JobTypeDetailUpdate(JobTypeDetail jobTypeDetail)
        {
            try
            {
                if (jobTypeDetail.JobTypeCode == 0)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "JobTypeCode is incorrect"));

                if (!ModelState.IsValid)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ModelStateError()));

                var jobTypeDetailModel = new Entity.Models.JobTypeDetail
                {
                    JobTypeCode = jobTypeDetail.JobTypeCode,
                    Priority = jobTypeDetail.Priority,
                    SlaTime = jobTypeDetail.SlaTime,
                    LastUpdated = DateTime.Now,
                    UpdatedBy = jobTypeDetail.UpdatedBy
                };

                var response = _requestProcessor.Process(new JobTypeDetailUpdateRequest { JobTypeDetail = jobTypeDetailModel }) as JobTypeDetailUpdateResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message))
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."));
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message));
            }
        }
    }
}