angular.module('MetronicApp').controller('IncidentDetailCtrl',
    function($state, $scope,$rootScope, $modalInstance,incident,ceos,jobTypes,vehicleColors, vehicleMakes, Utils, dataService) {
        $scope.incident = incident;
        $scope.ceos = ceos;
        $scope.jobTypes = jobTypes;
        $scope.vehicleColors = vehicleColors;
        $scope.vehicleMakes = vehicleMakes;

        //use to call API
        $scope.timeReported = Utils.extractDatetime(incident.TimeReported, API_DATETIME_FORMAT);

        //use to display in client
        $scope.date = Utils.extractDatetime(incident.TimeReported,DATE_FORMAT);
        $scope.time = Utils.extractDatetime(incident.TimeReported,'HH:mm');

        $scope.selectedMake = Utils.getVehicleMakeByNumber(incident.VehicleMake);
        $scope.selectedJobType = Utils.getJobtypeByCode(incident.IncidentType);
        $scope.selectedColor = Utils.getVehicleColorByCode(incident.VehicleColour);

        $scope.selectedCeo = Utils.getCeoByCode(incident.Ceo);

        //handle update button
        $scope.updateIncident = function(isValid,error){
            if(isValid){

                var info = {
                    IncidentNumber:incident.IncidentNumber,
                    IncidentType:$scope.selectedJobType?$scope.selectedJobType.JobTypeCode:null,
                    VehicleMake:$scope.selectedMake?$scope.selectedMake.MakeNumber:null,
                    VehicleColour:$scope.selectedColor?$scope.selectedColor.ColourNumber:null,
                    Location:$scope.incident.Location,
                    Latitude:$scope.incident.Latitude,
                    Longitude:$scope.incident.Longitude,
                    Notes:$scope.incident.Notes,
                    Vrm:$scope.incident.Vrm,
                    TimeReported:$scope.timeReported,
                    UpdatedBy:'Harrison',

                }
                $modalInstance.close(info);

            }else{
                $scope.incidentDetailForm.location.$pristine = false;
                $scope.incidentDetailForm.vrm.$pristine = false;
            }
        }

        //after modal close, call api
        $modalInstance.result.then(function (info) {
            dataService.updateIncident(info).then(function(){
                //update $rootScope.incidents
                var incidentType = Utils.getJobtypeByCode(info.IncidentType);

                $rootScope.selectedIncident.Location = info.Location;
                $rootScope.selectedIncident.Vrm = info.Vrm;

                $rootScope.selectedIncident.IncidentTypeName = incidentType.JobTypeDescription;
            })
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });



        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }

    })