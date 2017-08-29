using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Verona.Common.Request;
using Verona.Common.Response;
using Verona.Common.Wcf;
using Verona.Entity;
using Verona.Entity.Models;
using Verona.WebUI.Configuration;
using Verona.WebUI.Models;

namespace Verona.WebUI.Controllers
{
    public class JobQueueController : BaseController
    {
        private readonly IRequestProcessorService _requestProcessor;

        public JobQueueController(IRequestProcessorService requestProcessor)
        {
            _requestProcessor = requestProcessor;
        }

        /// <summary>
        /// Select list JobQueue (paging)
        /// </summary>
        /// <param name="jobQueueSearchModel"></param>
        /// <param name="pagingSortModel"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult SearchJobQueue(JobQueueSearchModel jobQueueSearchModel, PagingSortModel pagingSortModel)
        {
            try
            {
                if (!string.IsNullOrEmpty(pagingSortModel.SortColumn) && !QueryHelper.PropertyExists<JobQueueListModel>(pagingSortModel.SortColumn))
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "SortColumn parameter values do not exist in the list of columns"), JsonRequestBehavior.AllowGet);

                var response = _requestProcessor.Process(new SearchJobQueueRequest
                {
                    JobQueueSearchModel = jobQueueSearchModel,
                    PagingSort = pagingSortModel
                }) as SearchJobQueueResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message, response.TupleJobQueue), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Get JobQueue Detail
        /// </summary>
        /// <param name="jobNumber"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult JobQueueDetail(long jobNumber)
        {
            try
            {
                if (jobNumber == 0)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "JobNumber is incorrect"));

                var response = _requestProcessor.Process(new JobQueueDetailRequest { JobNumber = jobNumber }) as JobQueueDetailResponse;

                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message, response.JobQueue), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Update JobTask
        /// </summary>
        /// <param name="jobTaskList"></param>
        /// <param name="jobNumber"></param>
        /// <returns></returns>
        [HttpPut]
        public JsonResult UpdateJobTask(List<JobTaskModel> jobTaskList, long jobNumber)
        {
            try
            {
                if (jobNumber == 0)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "JobNumber is incorrect"));

                var response = _requestProcessor.Process(new UpdateJobTaskRequest { JobTaskList = jobTaskList, JobNumber = jobNumber }) as UpdateJobTaskResponse;

                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPut]
        public JsonResult JobQueueUpdate(JobQueueUpdate jobQueueUpdate)
        {
            try
            {
                if (jobQueueUpdate.JobNumber == 0)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "JobNumber is incorrect"));

                var jobQueueDetail = new JobQueue
                {
                    JobNumber = jobQueueUpdate.JobNumber,
                    Ceo = jobQueueUpdate.Ceo,
                    Vrm = jobQueueUpdate.Vrm,
                    VehicleMake = jobQueueUpdate.VehicleMake,
                    VehicleColour = jobQueueUpdate.VehicleColour,
                    SlaDateTime = jobQueueUpdate.SlaDateTime,
                    Location = jobQueueUpdate.Location,
                    Latitude = jobQueueUpdate.Latitude,
                    Longitude = jobQueueUpdate.Longitude,
                    Priority = jobQueueUpdate.Priority,
                    Notes = jobQueueUpdate.Notes,
                    LastUpdated = DateTime.Now,
                    UpdatedBy = jobQueueUpdate.UpdatedBy
                };
                var response = _requestProcessor.Process(new JobQueueUpdateRequest { JobQueue = jobQueueDetail }) as JobQueueUpdateResponse;

                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPut]
        public JsonResult JobQueueCancel(JobQueueCancel jobQueueCancel)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ModelStateError()));

                var response = _requestProcessor.Process(new JobQueueCancelRequest
                {
                    JobNumber = jobQueueCancel.JobNumber,
                    Notes = jobQueueCancel.Notes,
                    UpdateBy = jobQueueCancel.UpdatedBy
                }) as JobQueueCancelResponse;

                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPut]
        public JsonResult JobQueueReject(JobQueueReject jobQueueReject)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ModelStateError()));

                var response = _requestProcessor.Process(new JobQueueRejectRequest
                {
                    JobNumber = jobQueueReject.JobNumber,
                    ReasonNumber = jobQueueReject.ReasonNumber,
                    UpdateBy = jobQueueReject.UpdatedBy
                }) as JobQueueRejectResponse;

                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPut]
        public JsonResult JobQueueCompleted(JobQueueCompleted jobQueueCompleted)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ModelStateError()));

                var response = _requestProcessor.Process(new JobQueueCompletedRequest
                {
                    JobNumber = jobQueueCompleted.JobNumber,
                    Notes = jobQueueCompleted.Notes,
                    UpdateBy = jobQueueCompleted.UpdatedBy
                }) as JobQueueCompletedResponse;

                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }
    }
}