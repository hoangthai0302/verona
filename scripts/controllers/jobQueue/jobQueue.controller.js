angular.module('MetronicApp').controller('JobQueueCtrl', function (dataService, $rootScope, $state, $scope,$modal, $http, $timeout, $cookieStore, $window, DateUtils, Utils) {

    $scope.FILTER = FILTER;
    $scope.JOB_STATUS = JOB_STATUS;
    $scope.Utils = Utils;
    $scope.format = DATETIME_FORMAT;

    $scope.priorities = [0,1,2,3,4,5,6,7,8,9]

    $scope.disabledReportAbandoned = true;


    if (!$rootScope.jobFilter) {
        $rootScope.jobFilter = {
            status: JOB_STATUS.ALL,
            date: FILTER.TODAY,
            vrm: FILTER.ALL,
            ceo: FILTER.ALL,
            priority: FILTER.ALL,
            selectedPriority:5
        }
    }

    dataService.loadCEOs();
    dataService.loadJobTypes();
    dataService.loadVehicleMakes();
    dataService.loadVehicleColors();

    dataService.loadJobs().then(function(total){
        var currentPage = $rootScope.jobFilter.pageNum || 1;
        $scope.pager = Utils.getPager(total,currentPage,PAGE_SIZE);
    })

    $scope.sortDirection = {};
    $rootScope.jobFilter.sortColumn = 'TimeReported';

    $scope.sortClass="fa fa-sort-desc pull-right";

    $scope.getSortClass = function(key){
        if(key == $rootScope.jobFilter.sortColumn){
            if($rootScope.jobFilter.sortDirection){
                return 'fa fa-sort-asc pull-right';
            }else{
                return 'fa fa-sort-desc pull-right';
            }
        }else{
            return 'fa fa-sort pull-right'
        }
    }

    $scope.isActive = function(key){
        return key != $rootScope.jobFilter.sortColumn;
    }

    $scope.handleSort = function(key){
        var desc = $scope.sortDirection[key] || false;
        $scope.sortDirection[key] = !desc;

        $rootScope.jobFilter.sortDirection = desc;
        $rootScope.jobFilter.sortColumn = key;

        $scope.search();
    }

    $scope.$watch('selectedJob', function(newValue, oldValue) {
        var text = 'Confirmed abandoned';
        text = text.toUpperCase();

        if(newValue){
            try{
                if(newValue.Status == JOB_STATUS.COMPLETED && newValue.Notes.toUpperCase().indexOf(text) != -1){
                    $scope.disabledReportAbandoned = false;
                }else{
                    $scope.disabledReportAbandoned = true;
                }

            }catch(ex){}
        }

    }, true);

    $scope.checkDisabled = function(){
        if($rootScope.selectedJob){
            if($rootScope.selectedJob.Status == JOB_STATUS.COMPLETED || $rootScope.selectedJob.Status == JOB_STATUS.CANCELLED){
                return true;
            }
        }

        return false;
    }

    $scope.checkSlaExceed = function(job){
        if(job && job.Notes){
            var notes = job.Notes.toUpperCase();

            return notes.indexOf('SLA EXCEEDED') != -1
        }
        return false;
    }


    $scope.onSelectJob = function (job) {
        $rootScope.selectedJob = job;


    }

    $scope.openGovernmentWebSite = function(){
        window.open(REPORT_ABANDONED_SITE);
    }

    $scope.search = function () {
        //reset selectedIncident
        $rootScope.selectedJob = null;
        //cached currentPageNum
        $rootScope.jobFilter.pageNum = 1;

        if($rootScope.jobFilter.date == FILTER.DATE_RANGE){
            var dateFrom = $('#jobDateFrom').val();
            var dateTo = $('#jobDateTo').val();

            if(dateFrom){
                dateFrom = DateUtils.DDMMYY_toDateObject(dateFrom);
            }else{
                dateFrom = new Date();
            }

            if(dateTo){
                dateTo = DateUtils.DDMMYY_toDateObject(dateTo);
            }else{
                dateTo = new Date();
            }

            //this is use for case the datepicker not call change event if select the same date
            $rootScope.jobFilter.dateFrom = dateFrom;
            $rootScope.jobFilter.dateTo = dateTo;
        }


        dataService.loadJobs()
            .then(function(total){
                $scope.pager = Utils.getPager(total,1,PAGE_SIZE);
            })
    }

    $scope.reset = function () {
        $rootScope.jobFilter = {
            status: JOB_STATUS.ALL,
            date: FILTER.TODAY,
            vrm: FILTER.ALL,
            ceo: FILTER.ALL,
            priority: FILTER.ALL,
            dateFrom:'',
            dateTo:'',
            sortColumn:'TimeReported'
        }

        $('#jobDateFrom').val('');
        $('#jobDateTo').val('');
        $scope.search();

    }

    $scope.gotoPage = function(pageNum){
        //cached current pageNum
        $rootScope.jobFilter.pageNum = pageNum;
        $rootScope.selectedJob = null;

        dataService.loadJobs().then(function(total){
            $scope.pager = Utils.getPager(total,pageNum,PAGE_SIZE);
        })
    }

    $scope.jobPopup = function(action){
        if($rootScope.selectedJob){
            var job = angular.copy($rootScope.selectedJob);

            var templateUrl, controller;

            if(action == 'cancel'){

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'cancelJobModal.html',
                    size:'large',
                    controller: 'CancelJobModalCtr',
                    resolve:{
                        job:function(){
                            return job;
                        },
                        action:function(){
                            return action
                        }
                    }
                });
            }

            if(action == 'reject'){
                dataService.getRejectionReasons('', 1, 500, false).then(function(data){
                    var rejectionReasons = data.items;

                    $modal.open({
                        animation: true,
                        templateUrl: 'rejectJobModal.html',
                        size:'large',
                        controller: 'RejectJobModalCtr',
                        resolve:{
                            job:function(){
                                return job
                            },
                            rejectionReasons:function(){
                                return rejectionReasons;
                            }
                        }
                    });

                })
            }

            if(action == 'complete'){

                $modal.open({
                    animation: true,
                    templateUrl: 'completeJobModal.html',
                    size:'large',
                    controller: 'CompleteJobModalCtr',
                    resolve:{
                        job:function(){
                            return job;
                        }
                    }
                });
            }






        }else{
            $scope.openModal('No job has been selected!')
        }
    }

    $scope.viewJobProgress = function(){
        if($rootScope.selectedJob){

            var jobNumber = $rootScope.selectedJob.JobNumber;

            dataService.getJobQueueDetail(jobNumber).then(function(jobDetail){
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'viewJobProgressModal.html',
                    size:'large',
                    controller: 'ViewJobProgressModalCtrl',
                    resolve:{
                        jobDetail:function(){
                            return jobDetail;
                        }
                    }
                });

            });




        }else{
            $scope.openModal('No job has been selected!')
        }
    }

    $scope.changeDetailPopup = function(){
        if($rootScope.selectedJob){

            var jobNumber = $rootScope.selectedJob.JobNumber;

            dataService.getJobQueueDetail(jobNumber).then(function(jobDetail){
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'jobDetailModal.html',
                    size:'large',
                    controller: 'JobDetailModalCtrl',
                    resolve:{
                        jobDetail:function(){
                            return jobDetail;
                        }
                    }
                });

            });




        }else{
            $scope.openModal('No job has been selected!')
        }
    }
}).controller('ViewJobProgressModalCtrl',
    function($state, $scope, $modalInstance,jobDetail,Utils, dataService) {
        $scope.Utils = Utils;

        $scope.job = jobDetail;
        $scope.job.Description = $scope.selectedJob.JobTypeDescription;

        $scope.tasks = jobDetail.JobTasks;
        for(var i = 0; i < $scope.tasks.length; i++){
            $scope.tasks[i].Completed = $scope.tasks[i].StepOutcome?'Y':'N';
        }

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }

        $scope.updateJobTasks = function(){

            var jobTaskList = [];

            var countNo = 0;

            for(var i = 0; i < $scope.tasks.length; i++){
                var t = $scope.tasks[i];
                if(t.IsRequired && t.Completed != 'Y'){
                    countNo++;
                }

                jobTaskList.push({
                    Id:t.Id,
                    StepOutcome:t.Completed.toUpperCase() == 'Y'? true:false
                });

            }

            dataService.updateJobTask(jobTaskList, jobDetail.JobNumber).then(function(){
                //update data in client
                if(countNo == 0){
                    $scope.selectedJob.Status = JOB_STATUS.COMPLETED;
                }

            });
            //close modal
            $modalInstance.close();
        }



    })

    .controller('JobDetailModalCtrl',
    function($state, $scope, $modalInstance,jobDetail,Utils, dataService,DateUtils,$rootScope) {
        $scope.job = jobDetail;

        $scope.priorities= [0,1,2,3,4,5,6,7,8,9];

        $scope.createdDatetime = Utils.extractDatetime(jobDetail.CreatedDateTime, DATETIME_FORMAT);
        $scope.slaDateTime = Utils.extractDatetime(jobDetail.SlaDateTime, DATETIME_FORMAT);
        if($scope.slaDateTime){
            $scope.slaDateTime = moment($scope.slaDateTime,DATETIME_FORMAT);
        }



        var isAfter = $scope.createdDatetimeObj > $scope.slaDateTime;

        $scope.selectedMake = Utils.getVehicleMakeByNumber(jobDetail.VehicleMake);
        $scope.selectedColor = Utils.getVehicleColorByCode(jobDetail.VehicleColour);
        $scope.selectedCeo = Utils.getCeoByCode(jobDetail.Ceo);

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }


        $scope.updateJobQueue = function(isValid,error){

            if(isValid){
                var makeNumber = $scope.selectedMake? $scope.selectedMake.MakeNumber : '';
                var colorNumber = $scope.selectedColor? $scope.selectedColor.ColourNumber : '';

                var data = {
                    "JobNumber": jobDetail.JobNumber,
                    "Vrm": $scope.job.Vrm,
                    "VehicleMake": makeNumber,
                    "VehicleColour": colorNumber,
                    "Location": $scope.job.Location,
                    "Latitude": $scope.job.Latitude,
                    "Longitude": $scope.job.Longitude,
                    "SlaDateTime":  moment($scope.slaDateTime).format(API_DATETIME_FORMAT),
                    "Ceo": $scope.selectedCeo.Code,
                    "Priority": $scope.job.Priority,
                    "Notes": $scope.job.Notes,
                    "UpdatedBy": "admin"
                }

                if($scope.createdDatetime){
                    $scope.createdDatetimeObj = moment($scope.createdDatetime, DATETIME_FORMAT);
                    if($scope.createdDatetimeObj.isSameOrAfter($scope.slaDateTime)){
                        $rootScope.openModal('SLA time is before creation time.');
                    }else{

                        dataService.updateJobQueue(data).then(function(){
                            //update data in client
                            $scope.selectedJob.JobTypeDescription = $scope.job.JobTypeName;
                            $scope.selectedJob.Priority = $scope.job.Priority;
                            $scope.selectedJob.Location = $scope.job.Location;
                            $scope.selectedJob.Vrm = $scope.job.Vrm;
                            $scope.selectedJob.Notes = $scope.job.Notes;
                            $scope.selectedJob.CeoName = $scope.selectedCeo.Name;
                        });
                        //close modal
                        $modalInstance.close();
                    }
                }else{

                    dataService.updateJobQueue(data).then(function(){
                        //update data in client
                        $scope.selectedJob.JobTypeDescription = $scope.job.JobTypeName;
                        $scope.selectedJob.Priority = $scope.job.Priority;
                        $scope.selectedJob.Location = $scope.job.Location;
                        $scope.selectedJob.Vrm = $scope.job.Vrm;
                        $scope.selectedJob.Notes = $scope.job.Notes;
                        $scope.selectedJob.CeoName = $scope.selectedCeo.Name;
                    });
                    //close modal
                    $modalInstance.close();
                }

            }else{
                $scope.jobDetailForm.location.$pristine = false;
                $scope.jobDetailForm.vrm.$pristine = false;
            }



        }



    })
    .controller('CancelJobModalCtr',
    function($state, $scope, $modalInstance,job,dataService) {
        $scope.job = job;
        $scope.cancelJob = function(){
            var reason = $scope.reason;
            if(!reason){
                $scope.openModal('You need to enter a cancellation reason.');
            }else{
                var info = {
                    "JobNumber": job.JobNumber,
                    "Notes": reason,
                    "UpdatedBy": "admin"
                }
                dataService.cancelJobQueue(info).then(function(){
                    //update data in client
                    $scope.selectedJob.Status = JOB_STATUS.CANCELLED;
                    $scope.selectedJob.Notes = reason;
                });

                //close modal
                $modalInstance.close();
            }
        }

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }


    })
    .controller('RejectJobModalCtr',
        function($state, $scope, $modalInstance,job, dataService, rejectionReasons) {
            $scope.job = job;

            $scope.rejectionReasons = rejectionReasons;

            $scope.close = function () {
                $modalInstance.dismiss('cancel');
            }

            $scope.rejectJob = function(){

                if(!$scope.selectedReason){
                    $scope.openModal('You need to choose a rejection reason.')
                }else{
                    var reasonNumber = $scope.selectedReason.ReasonNumber;

                    var info = {
                        "JobNumber": job.JobNumber,
                        "ReasonNumber": reasonNumber,
                        "UpdatedBy": "admin"
                    }

                    dataService.rejectJobQueue(info).then(function(){
                        //update data in client
                        $scope.selectedJob.Status = JOB_STATUS.REJECT;
                        $scope.selectedJob.Notes = $scope.selectedReason.Description;
                    })
                    //close modal
                    $modalInstance.close();

                }

            }



        })
    .controller('CompleteJobModalCtr',
        function($state, $scope, $modalInstance,job, dataService) {
            $scope.job = job;

            $scope.close = function () {
                $modalInstance.dismiss('cancel');
            }

            $scope.completeJob = function(){
                var reason = $scope.reason;
                if(!reason){
                    $scope.openModal('Please enter a reason to complete this job.');
                }else{
                    var info = {
                        "JobNumber": job.JobNumber,
                        "Notes": reason,
                        "UpdatedBy": "admin"
                    }
                    dataService.completeJobQueue(info).then(function(){
                        //update data in client
                        $scope.selectedJob.Status = 'C';
                        $scope.selectedJob.Notes = reason;
                    })

                    //close modal
                    $modalInstance.close();
                }
            }

            $scope.close = function () {
                $modalInstance.dismiss('cancel');
            }


        })
