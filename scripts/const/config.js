
const SERVER_API = "http://localhost:60483/";
const STATUS_SUCCESS = 1;
const STATUS_ERROR = 0;
const STATUS_ACCESS_DENIED = 3;

const DATE_FORMAT = 'DD/MM/YYYY';  //display datetime using this format
const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';
const API_DATE_FORMAT = 'YYYY/MM/DD';  //call api using this format
const API_DATETIME_FORMAT = 'YYYY/MM/DD HH:mm';  //call api using this format
const PAGE_SIZE = 20;//

const REPORT_ABANDONED_SITE = 'https://www.gov.uk/report-abandoned-vehicle';

const API = {
    LIST_INCIDENTS : 'IncidentList/SearchIncident',
    LIST_VEHICLE_MAKE : 'VehicleMake/GetAllVehicleMake',
    LIST_VEHICLE_COLOR:'VehicleColour/GetAllVehicleColour',
    LIST_CEO:'CeoDetail/GetAllCeoDetail',
    LIST_JOB_TYPE:'JobTypeDetail/GetAllJobTypeDetail',

    ASSIGN_CEO:'IncidentList/AssignCeoSave',
    INSERT_INCIDENT:'IncidentList/InsertIncident',
    UPDATE_INCIDENT:'IncidentList/UpdateIncident',
    CLOSE_INCIDENT:'IncidentList/CloseIncident',
    INCIDENT_DETAIL:'IncidentList/IncidentListDetail',



    LIST_JOBS :'JobQueue/SearchJobQueue',
    JOB_QUEUE_DETAILED:'JobQueue/JobQueueDetail',
    JOB_QUEUE_UPDATE:'JobQueue/JobQueueUpdate',
    JOB_QUEUE_CANCEL:'JobQueue/JobQueueCancel',
    JOB_QUEUE_REJECT:'JobQueue/JobQueueReject',
    JOB_QUEUE_COMPLETE:'JobQueue/JobQueueCompleted',
    UPDATE_JOB_TASK:'JobQueue/UpdateJobTask',

    GET_JOB_DETAILED:'JobTypeDetail/JobTypeDetailGetByCode',
    UPDATE_JOB_DETAILED:'JobTypeDetail/JobTypeDetailUpdate',

    LIST_REJECTION_REASON:'RejectionReason/RejectionReasonPaging',
    ADD_REJECTION_REASON: 'RejectionReason/RejectionReasonInsert',
    DELETE_REASON:'RejectionReason/RejectionReasonDelete',
    UPDATE_REASON:'RejectionReason/RejectionReasonUpdate',

    VIEW_TASKLIST:'TaskList/TaskListGetByJobTypeCode',
    UPDATE_TASKLIST:'TaskList/TaskListUpdate'


}

const MESSAGES = {
    NO_INCIDENT_SELECTED :'No incident has been selected!',
    NO_CEO_SELECTED:'No Ceo has been selected!',
    NO_REASON_SELECTED:'No Reason has been selected!',
    NO_JOBTYPE_SELECTED:'No job type has been selected!',
    REJECTION_REASON_EMPTY:'Enter the reason you are closing the incident before continuing!'
}

const FILTER = {
    ALL: 'all',
    SELECTED: 'selected',
    CLOSED: 'closed',
    TODAY: 'today',
    THIS_MONTH: 'this month',
    THIS_WEEK: 'this week',
    DATE_RANGE: 'date range',
}

const JOB_STATUS = {
    ALL: '',
    COMPLETED: 'C',
    CANCELLED: 'X',
    IN_PROGRESS: 'P',
    NEW: 'N',
    REJECT:'R'
}

const INCIDENT_TYPE = {
    TICKET_REQUEST: 'Ticket Request',
    ABANDONED_CAR: 'Abandoned Car',
    CODE_RED: 'CODE RED'
}