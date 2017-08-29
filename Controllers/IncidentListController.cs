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
    public class IncidentListController : BaseController
    {
        private readonly IRequestProcessorService _requestProcessor;

        public IncidentListController(IRequestProcessorService requestProcessor)
        {
            _requestProcessor = requestProcessor;
        }

        /// <summary>
        ///     Select list Incident (paging)
        /// </summary>
        /// <param name="incidentSearchModel"></param>
        /// <param name="pagingSortModel"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult SearchIncident(IncidentSearchModel incidentSearchModel, PagingSortModel pagingSortModel)
        {
            try
            {
                if (!string.IsNullOrEmpty(pagingSortModel.SortColumn) && !QueryHelper.PropertyExists<IncidentListModel>(pagingSortModel.SortColumn))
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "SortColumn parameter values do not exist in the list of columns"), JsonRequestBehavior.AllowGet);

                var response = _requestProcessor.Process(new SearchIncidentRequest
                {
                    IncidentSearchModel = incidentSearchModel,
                    PagingSort = pagingSortModel
                }) as SearchIncidentResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message, response.TupleIncident), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        ///     Add new Incident
        /// </summary>
        /// <param name="incidentList"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult InsertIncident(IncidentList incidentList)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ModelStateError()));

                var incident = new Entity.Models.IncidentList
                {
                    IncidentType = incidentList.IncidentType,
                    Vrm = incidentList.Vrm,
                    VehicleMake = incidentList.VehicleMake,
                    VehicleColour = incidentList.VehicleColour,
                    Location = incidentList.Location,
                    Latitude = incidentList.Latitude,
                    Longitude = incidentList.Longitude,
                    Notes = incidentList.Notes,
                    TimeReported = incidentList.TimeReported,
                    UpdatedBy = incidentList.UpdatedBy,
                    LastUpdated = DateTime.Now,
                    JobNumber = null,
                    JobStatus = null
                };
                var response = _requestProcessor.Process(new InsertIncidentRequest
                {
                    IncidentList = incident
                }) as InsertIncidentResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message, response.IncidentNumber))
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."));
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message));
            }
        }

        /// <summary>
        ///     Update Incident
        /// </summary>
        /// <param name="incidentList"></param>
        /// <returns></returns>
        [HttpPut]
        public JsonResult UpdateIncident(IncidentList incidentList)
        {
            try
            {
                if (incidentList.IncidentNumber == 0)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "IncidentNumber is incorrect"));

                if (!ModelState.IsValid)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ModelStateError()));

                var incident = new Entity.Models.IncidentList
                {
                    IncidentNumber = incidentList.IncidentNumber,
                    IncidentType = incidentList.IncidentType,
                    Vrm = incidentList.Vrm,
                    VehicleMake = incidentList.VehicleMake,
                    VehicleColour = incidentList.VehicleColour,
                    Location = incidentList.Location,
                    Latitude = incidentList.Latitude,
                    Longitude = incidentList.Longitude,
                    Notes = incidentList.Notes,
                    TimeReported = incidentList.TimeReported,
                    UpdatedBy = incidentList.UpdatedBy,
                    LastUpdated = DateTime.Now,
                    JobNumber = null,
                    JobStatus = null
                };
                var response = _requestProcessor.Process(new UpdateIncidentRequest
                {
                    IncidentList = incident
                }) as UpdateIncidentResponse;
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
        ///     Close Incident
        /// </summary>
        /// <param name="incidentNumber"></param>
        /// <param name="notes"></param>
        /// <returns></returns>
        [HttpPut]
        public JsonResult CloseIncident(long incidentNumber, string notes)
        {
            try
            {
                if (incidentNumber == 0)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "IncidentNumber is incorrect"));

                if (string.IsNullOrEmpty(notes))
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error,
                        "Enter the reason you are closing the incident before continuing"));

                if (notes.Length > 500)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "Notes more than 500 characters"));

                var response = _requestProcessor.Process(new CloseIncidentRequest
                {
                    IncidentNumber = incidentNumber,
                    Notes = notes
                }) as CloseIncidentResponse;
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
        ///     Get AssignCeoDetail
        /// </summary>
        /// <param name="incidentNumber"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult IncidentListDetail(long incidentNumber)
        {
            try
            {
                if (incidentNumber == 0)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "IncidentNumber is incorrect"), JsonRequestBehavior.AllowGet);

                var response = _requestProcessor.Process(new IncidentListDetailRequest { IncidentNumber = incidentNumber }) as IncidentListDetailResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message, response.IncidentListDetail), JsonRequestBehavior.AllowGet)
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message),
                    JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        ///     Save Assign Ceo
        /// </summary>
        /// <param name="incidentNumber"></param>
        /// <param name="ceoCode"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult AssignCeoSave(long incidentNumber, long ceoCode)
        {
            try
            {
                if (incidentNumber == 0)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "IncidentNumber is incorrect"));

                if (ceoCode == 0)
                    return Json(new ResponseResult((int)Contant.ResponseStatus.Error, "CeoCode is incorrect"));

                var response = _requestProcessor.Process(new AssignCeoSaveRequest
                {
                    IncidentNumber = incidentNumber,
                    CeoCode = ceoCode
                }) as AssignCeoSaveResponse;
                return response != null
                    ? Json(new ResponseResult(response.Status, response.Message, response.JobNumberAndStatus))
                    : Json(new ResponseResult((int)Contant.ResponseStatus.Error, "An error has occurred, please contact ICES support."));
            }
            catch (Exception ex)
            {
                return Json(new ResponseResult((int)Contant.ResponseStatus.Error, ex.Message));
            }
        }
    }
}