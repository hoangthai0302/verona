angular.module('MetronicApp').controller('IncidentCtrl', function (dataService, $rootScope, $state, $stateParams, $scope,$modal, $http, $timeout, $cookieStore, $window, DateUtils, Utils, DomUtils) {

    $scope.FILTER = FILTER;
    $scope.Utils = Utils;

    //pass incFilter to rootscope to save the filter state when go back
    if (!$rootScope.incFilter) {
        $rootScope.incFilter = {
            status: FILTER.ALL,
            date: FILTER.TODAY,
            vrm: FILTER.ALL,
            ceo: FILTER.ALL
        }
    }

    dataService.loadCEOs();
    dataService.loadJobTypes();
    dataService.loadVehicleMakes();
    dataService.loadVehicleColors();

    dataService.loadIncidents().then(function(total){
        var currentPage = $rootScope.incFilter.pageNum || 1;
        $scope.pager = Utils.getPager(total,currentPage,PAGE_SIZE);
    })



    $scope.dataService = dataService;

    $scope.onSelectIncident = function(incident){
        $rootScope.selectedIncident = incident;
    }

    $scope.search = function () {
        //reset selectedIncident
        $rootScope.selectedIncident = null;
        //cached currentPageNum
        $rootScope.incFilter.pageNum = 1;

        if($rootScope.incFilter.date == FILTER.DATE_RANGE){
            var dateFrom = $('#incDateFrom').val();
            var dateTo = $('#incDateTo').val();

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
            $rootScope.incFilter.dateFrom = dateFrom;
            $rootScope.incFilter.dateTo = dateTo;
        }


        dataService.loadIncidents()
            .then(function(total){
            $scope.pager = Utils.getPager(total,1,PAGE_SIZE);
        })

    }

    $scope.sortDirection = {};

    $scope.sortClass="fa fa-sort-desc pull-right";

    $scope.getSortClass = function(key){
        if(key == $rootScope.incFilter.sortColumn){
            if($rootScope.incFilter.sortDirection){
                return 'fa fa-sort-asc pull-right';
            }else{
                return 'fa fa-sort-desc pull-right';
            }
        }else{
            return 'fa fa-sort pull-right'
        }
    }

    $scope.isActive = function(key){
        return key != $rootScope.incFilter.sortColumn;
    }

    $rootScope.incFilter.sortColumn = 'TimeReported';

    $scope.handleSort = function(key){
        var desc = $scope.sortDirection[key] || false;
        $scope.sortDirection[key] = !desc;

        $rootScope.incFilter.sortDirection = desc;
        $rootScope.incFilter.sortColumn = key;

        $scope.search();
    }

    $scope.refresh = function(){
        $scope.resetFilter();
        $rootScope.incFilter.pageNum = 1;
        $scope.search();
    }

    $scope.gotoPage = function(pageNum){
        //cached current pageNum
        $rootScope.incFilter.pageNum = pageNum;
        $rootScope.selectedIncident = null;

        dataService.loadIncidents().then(function(total){
            $scope.pager = Utils.getPager(total,pageNum,PAGE_SIZE);
        })
    }


    $scope.resetFilter = function(){
        $rootScope.incFilter = {
            status: FILTER.ALL,
            date: FILTER.TODAY,
            vrm: FILTER.ALL,
            ceo: FILTER.ALL,
            dateFrom:'',
            dateTo:'',
            sortColumn:'TimeReported'
        }

        $('#incDateFrom').val('');
        $('#incDateTo').val('');

    };

    $scope.openNoIncidentSelectedPopup = function(){
        $modal.open({
            animation: true,
            templateUrl: 'noIncidentSelectedModal.html',
            controller:'NoIncidentSelectedModalCtr',
            size:'large'
        });
    }

    $scope.openAddIncidentPopup = function(){
        var modalInstance = $modal.open({
            animation: true,
            size:'large',
            templateUrl: 'scripts/views/incident/incidentAdd.page.html',
            controller: 'IncidentAddCtrl',
            resolve:{
                jobTypes:function(){
                    return $rootScope.jobTypes;
                },

                vehicleColors:function(){
                    return $rootScope.vehicleColors;
                },
                vehicleMakes:function () {
                    return $rootScope.vehicleMakes;
                }
            }

        });

        modalInstance.result.then(function (info) {
            $scope.refresh();
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.openAssignCeo = function () {
        if($rootScope.selectedIncident){
            var incidentNumber = $rootScope.selectedIncident.IncidentNumber;
            dataService.loadIncidentDetail(incidentNumber).then(function(incident){
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'scripts/views/incident/incidentCeo.page.html',
                    size:'large',
                    controller: 'IncidentCeoModalCtrl',
                    resolve:{
                        ceos:function(){
                            return $rootScope.ceos;
                        },
                        incident:function(){
                            return incident;
                        }
                    }

                });


            });
        }else{
            $scope.openModal(MESSAGES.NO_INCIDENT_SELECTED);
        }

    }



    $scope.openViewIncidentPopup = function(){
        if($rootScope.selectedIncident){
            var incidentNumber = $rootScope.selectedIncident.IncidentNumber;
            dataService.loadIncidentDetail(incidentNumber).then(function(incident){

                if(incident && incident.IncidentNumber){
                    $modal.open({
                        animation: true,
                        templateUrl: 'scripts/views/incident/incidentDetail.page.html',
                        size:'large',
                        controller: 'IncidentDetailCtrl',
                        resolve:{
                            incident:function(){
                                return incident;
                            },
                            ceos:function(){
                                return $rootScope.ceos;
                            },
                            jobTypes:function(){
                                return $rootScope.jobTypes;
                            },

                            vehicleColors:function(){
                                return $rootScope.vehicleColors;
                            },
                            vehicleMakes:function () {
                                return $rootScope.vehicleMakes;
                            }
                        }

                    });



                }

            })


        }else{
            $scope.openModal(MESSAGES.NO_INCIDENT_SELECTED);
        }
    }

    $scope.openCloseIncidentPopup = function(){
        if($rootScope.selectedIncident){
            var incidentNumber = $rootScope.selectedIncident.IncidentNumber;
            dataService.loadIncidentDetail(incidentNumber).then(function(incident){

                if(incident && incident.IncidentNumber){
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'scripts/views/incident/incidentClose.page.html',
                        size:'large',
                        controller: 'IncidentCloseModalCtrl',
                        resolve:{
                            incident:function(){
                              return incident;
                            },
                            ceos:function(){
                                return $rootScope.ceos;
                            },
                            jobTypes:function(){
                                return $rootScope.jobTypes;
                            },

                            vehicleColors:function(){
                                return $rootScope.vehicleColors;
                            },
                            vehicleMakes:function () {
                                return $rootScope.vehicleMakes;
                            }
                        }

                    });

                    modalInstance.result.then(function (info) {
                        dataService.closeIncident(info).then(function(){
                            $scope.refresh();
                        })
                    }, function () {
                        //$log.info('Modal dismissed at: ' + new Date());
                    });

                }

            })


        }else{
            $scope.openModal(MESSAGES.NO_INCIDENT_SELECTED);
        }
    }



})

    .controller('ReasonEmptyModalCtr',
        function($state, $scope, $modalInstance) {

            $scope.close = function () {
                $modalInstance.dismiss('cancel');
            }

        })
    .controller('NoIncidentSelectedModalCtr',
        function($state, $scope, $modalInstance) {


            $scope.close = function () {
                $modalInstance.dismiss('cancel');
            }


        });