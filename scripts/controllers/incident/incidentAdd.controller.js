angular.module('MetronicApp').controller('IncidentAddCtrl',
    function($state, $scope, $modalInstance,jobTypes,vehicleColors, vehicleMakes,dataService) {
        $scope.jobTypes = jobTypes;
        $scope.vehicleColors = vehicleColors;
        $scope.vehicleMakes = vehicleMakes;
        $scope.date = moment().format('DD/MM/YYYY');
        $scope.time = moment().format('HH:mm');
        $scope.timeReported = moment().format(API_DATETIME_FORMAT);
        $scope.createdBy = "Harrison"

        $scope.addIncident = function(isValid){
            if(isValid){
                var info = {
                    jobTypeCode:$scope.jobTypeCode,
                    makeNumber:$scope.makeNumber || '',
                    colorNumber:$scope.colorNumber || '',
                    location:$scope.location,
                    latitude:$scope.latitude,
                    longtitude:$scope.longtitude,
                    notes:$scope.notes,
                    vrm:$scope.vrm,
                    timeReported:$scope.timeReported,
                    updatedBy:$scope.createdBy
                }
                dataService.insertIncident(info).then(function(){
                    $modalInstance.close();
                })
            }else{
                $scope.addIncidentForm.location.$pristine = false;
                $scope.addIncidentForm.jobTypeCode.$pristine = false;
                $scope.addIncidentForm.vrm.$pristine = false;
            }
        }

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }
    })