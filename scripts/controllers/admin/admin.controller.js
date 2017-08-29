angular.module('MetronicApp')
    .controller('AdminCtrl', function (dataService, $rootScope, $state, $scope, $http, $timeout, $modal, $window, Utils) {

        $rootScope.showAdminChoices = function(){
            $scope.showAdmin = true;
            $scope.showJobParams = false;
            $scope.showRejectionReasons = false;

        };

        $rootScope.showAdminChoices();

        $scope.showJP = function () {
            $scope.showAdmin = false;
            $scope.showJobParams = true;
            $scope.showRejectionReasons = false;
        }

        $scope.showRR = function () {
            $scope.showAdmin = false;
            $scope.showJobParams = false;
            $scope.showRejectionReasons = true;
        }

        dataService.loadCEOs();
        dataService.loadVehicleMakes();
        dataService.loadVehicleColors();

        if(!$rootScope.jobParams){
            $rootScope.jobParams = {
                pageNum:1
            }
        }

        $scope.onSelectJobType = function(jobType){
            $rootScope.selectedJobType = jobType;
        }

        getJobTypesPaging();

        $scope.gotoPage = function(pageNum){
            //cached current pageNum
            $rootScope.jobParams.pageNum = pageNum;
            //reset selected jobtype
            $rootScope.selectedJobType = null;

            getJobTypesPaging();
        }

        function getJobTypesPaging(){
            dataService.loadJobTypes().then(function(total){

                var currentPage = $rootScope.jobParams.pageNum || 1;
                $scope.pager = Utils.getPager(total,currentPage,PAGE_SIZE);

                $rootScope.jobTypesPaging = [];
                for(var i = $scope.pager.startIndex; i <= $scope.pager.endIndex; i++){
                    $rootScope.jobTypesPaging.push($rootScope.jobTypes[i]);
                }

            })
        }

        $scope.sortDirection = {};
        $scope.jobTypeSortColumn = 'JobTypeCode';

        $scope.handleSort = function(key, isString){
            var desc = $scope.sortDirection[key] || false;
            $scope.sortDirection[key] = !desc;

            $rootScope.jobTypes.sortOn({key:key, string:isString}, desc)

            $rootScope.jobTypesPaging = [];
            for(var i = $scope.pager.startIndex; i <= $scope.pager.endIndex; i++){
                $rootScope.jobTypesPaging.push($rootScope.jobTypes[i]);
            }

            $scope.jobTypeSortColumn = key;

        }

        $scope.sortClass="fa fa-sort-desc pull-right";

        $scope.getSortClass = function(key){
            if(key == $scope.jobTypeSortColumn){
                if($scope.sortDirection[key]){
                    return 'fa fa-sort-asc pull-right';
                }else{
                    return 'fa fa-sort-desc pull-right';
                }
            }else{
                return 'fa fa-sort pull-right'
            }
        }

        $scope.isActive = function(key){
            return key != $scope.jobTypeSortColumn;
        }



        $scope.openJobTypeDetail = function(){
            if($rootScope.selectedJobType){
                var code = $rootScope.selectedJobType.JobTypeCode;
                dataService.loadJobTypeDetail(code).then(function(jobType){

                    if(jobType && jobType.JobTypeCode){
                        $modal.open({
                            animation: true,
                            templateUrl: 'scripts/views/admin/jobTypeDetail.page.html',
                            size:'large',
                            controller: 'JobTypeDetailCtrl',
                            resolve:{
                                jobType:function(){
                                    return jobType;
                                }
                            }

                        });
                    }

                })


            }else{
                $scope.openModal(MESSAGES.NO_JOBTYPE_SELECTED);
            }
        }

        //=============================REJECTION REASON================================/

        //sortColumn, pageNum, pageSize, sortAsc
        var sortColumn = '';

        if (!$rootScope.rejectionFilter) {
            $rootScope.rejectionFilter = {
                sortColumn: '',
                pageNum: 1,
                pageSize: PAGE_SIZE,
                sortAsc: ''
            }
        }

        $scope.loadRejectionReasons = function(){

            var sortColumn = $rootScope.sortColumn || '';
            var pageNum = $rootScope.rejectionFilter.pageNum || 1;
            var sortAsc = $rootScope.sortAsc || '';

            var pageSize = PAGE_SIZE;

            dataService.getRejectionReasons('', pageNum, pageSize, false).then(function(data){
                $rootScope.rejectionReasons = data.items;

                var total = data.total;
                var pageNum = $rootScope.rejectionFilter.pageNum  || 1;

                $scope.rPager = Utils.getPager(total,pageNum,pageSize);
            })
        }

        $scope.loadRejectionReasons();

        $scope.onSelectReason = function(r){
            $rootScope.selectedReason = r;
        }


        $scope.gotoPageRejection = function(pageNum){
            //cached current pageNum
            $rootScope.rejectionFilter.pageNum = pageNum;
            //reset selected reason
            $rootScope.selectedReason = null

            $scope.loadRejectionReasons();
        }

        $scope.viewTaskList = function(){
            if($rootScope.selectedJobType
            ){

                dataService.viewTaskList($rootScope.selectedJobType.JobTypeCode).then(function(list){

                    var modalInstance = $modal.open({
                        animation: true,
                        size:'large',
                        templateUrl: 'viewTaskListModal.html',
                        controller: 'ViewTaskListModalCtrl',
                        resolve:{
                            taskList:function(){
                                return list;
                            }
                        }
                    });
                })

            }else{
                $scope.openModal(MESSAGES.NO_JOBTYPE_SELECTED)
            }
        }

        $scope.addReasonPopup = function(){
            var modalInstance = $modal.open({
                animation: true,
                size:'large',
                templateUrl: 'scripts/views/admin/addReasonModal.page.html',
                controller: 'AddReasonModalCtrl',
            });

            modalInstance.result.then(function (reasonDesc) {
                dataService.addRejectionReason(reasonDesc).then(function () {
                    $scope.loadRejectionReasons();
                })
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.updateReasonPopup = function(){

            if($rootScope.selectedReason){

                var modalInstance = $modal.open({
                    animation: true,
                    size:'large',
                    templateUrl: 'updateReasonModal.html',
                    controller: 'UpdateReasonModalCtrl'
                });


            }else{
                $scope.openModal(MESSAGES.NO_REASON_SELECTED)
            }


        }


        $scope.deleteReasonPopup = function(){

            if($rootScope.selectedReason){

                var modalInstance = $modal.open({
                    animation: true,
                    size:'large',
                    templateUrl: 'deleteReasonModal.html',
                    controller: 'DeleteReasonModalCtrl'
                });

                modalInstance.result.then(function () {
                    var number = $scope.selectedReason.ReasonNumber;
                    dataService.deleteReason(number).then(function () {
                        $scope.loadRejectionReasons();
                    })
                }, function () {
                    //$log.info('Modal dismissed at: ' + new Date());
                });
            }else{
                $scope.openModal(MESSAGES.NO_REASON_SELECTED)
            }


        }




})
    .controller('AddReasonModalCtrl',
        function($state, $scope, $modal, $modalInstance) {

            $scope.close = function () {
                $modalInstance.dismiss('cancel');
            }

            $scope.addReason = function(){
                if(!$scope.reasonDesc){
                    $scope.openModal('You need to enter the new rejection reason!')
                }else{
                    $modalInstance.close($scope.reasonDesc);
                }

            }

        })
    .controller('UpdateReasonModalCtrl',
        function($state, $scope, $modal, $modalInstance,dataService) {

            $scope.close = function () {
                $modalInstance.dismiss('cancel');
            }

            $scope.updateReason = function(){
                if(!$scope.newDescription){
                    $scope.openModal('Please enter new reason.');
                }else{

                    var number = $scope.selectedReason.ReasonNumber;
                    var updatedBy = 'Admin'
                    dataService.updateReason(number, $scope.newDescription, updatedBy).then(function () {
                        //update client data
                        $scope.selectedReason.Description = $scope.newDescription;
                    })


                    $modalInstance.close($scope.newDescription);
                }
            }

        })
    .controller('DeleteReasonModalCtrl',
        function($state, $scope, $modal, $modalInstance) {

            $scope.close = function () {
                $modalInstance.dismiss('cancel');
            }

            $scope.deleteReason = function(){
                $modalInstance.close();
            }

        })
    .controller('ViewTaskListModalCtrl',
        function($state, $scope, $modal, $modalInstance, taskList,dataService) {



            for(var i = 0; i < taskList.length; i++){
                var task = taskList[i];
                task.required = task.IsRequired?'Y':'N';
            }

            $scope.taskList = taskList;

            if($scope.taskList.length){
                $scope.firstTask = $scope.taskList.shift();
            }

            $scope.updateTaskList = function(){
                for(var i = 0; i < taskList.length; i++){

                    var t = taskList[i];
                    t.IsRequired = t.required.toUpperCase() == 'Y';

                    var info= {
                        "TaskId": t.TaskId,
                            "JobTypeCode": t.JobTypeCode,
                            "StepNumber": t.StepNumber,
                            "TaskDescription": t.TaskDescription,
                            "IsRequired": t.IsRequired,
                            "DependsOn": t.DependsOn
                    }

                    dataService.updateTaskList(info).then(function(){

                    })
                }
                $modalInstance.close();
            }

            $scope.close = function () {
                $modalInstance.dismiss('cancel');
            }

        });;