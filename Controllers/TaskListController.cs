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
    public class TaskListController : BaseController
    {
        private readonly IRequestProcessorService _requestProcessor;

        public TaskListController(IRequestProcessorService requestProcessor)
        {
            _requestProcessor = requestProcessor;
        }

        /// <summary>
        /// Get TaskList By JobTypeCode
        /// </summary>
        /// <param name="jobTypeCode"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult TaskListGetByJobTypeCode(long jobTypeCode)
        {
            try
            {
                if (jobTypeCode == 0)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "JobTypeCode is incorrect"), JsonRequestBehavior.AllowGet);

                var response = _requestProcessor.Process(new TaskListGetByJobTypeCodeRequest{JobTypeCode = jobTypeCode}) as TaskListGetByJobTypeCodeResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message, response.TaskList), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Insert TaskList
        /// </summary>
        /// <param name="taskList"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult TaskListInsert(TaskList taskList)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ModelStateError()));

                var taskListModel = new Entity.Models.TaskList
                {
                    JobTypeCode = taskList.JobTypeCode,
                    StepNumber = taskList.StepNumber,
                    TaskDescription = taskList.TaskDescription,
                    IsRequired = taskList.IsRequired,
                    DependsOn = taskList.DependsOn
                };
                var response = _requestProcessor.Process(new TaskListInsertRequest
                {
                    TaskListModel = taskListModel
                }) as TaskListInsertResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message, response.TaskId))
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."));
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message));
            }
        }

        /// <summary>
        /// Update TaskList
        /// </summary>
        /// <param name="taskList"></param>
        /// <returns></returns>
        [HttpPut]
        public JsonResult TaskListUpdate(TaskList taskList)
        {
            try
            {
                if (taskList.TaskId == 0)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "TaskId is incorrect"));

                if (!ModelState.IsValid)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ModelStateError()));

                var taskListModel = new Entity.Models.TaskList
                {
                    TaskId = taskList.TaskId,
                    JobTypeCode = taskList.JobTypeCode,
                    StepNumber = taskList.StepNumber,
                    TaskDescription = taskList.TaskDescription,
                    IsRequired = taskList.IsRequired,
                    DependsOn = taskList.DependsOn
                };
                var response = _requestProcessor.Process(new TaskListUpdateRequest
                {
                    TaskListModel = taskListModel
                }) as TaskListUpdateResponse;
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
        /// Delete TaskList
        /// </summary>
        /// <param name="taskId"></param>
        /// <returns></returns>
        [HttpDelete]
        public JsonResult TaskListDelete(long taskId)
        {
            try
            {
                if (taskId == 0)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "TaskId is incorrect"));

                var response = _requestProcessor.Process(new TaskListDeleteRequest
                {
                    TaskId = taskId
                }) as TaskListDeleteResponse;
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