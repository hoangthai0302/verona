angular.module('MetronicApp').controller('IncidentCloseModalCtrl',
    function($state, $scope, $modalInstance,incident,Utils, $modal) {
        $scope.timeReported = Utils.extractDatetime(incident.TimeReported);

        $scope.date = Utils.extractDatetime(incident.TimeReported,DATE_FORMAT);
        $scope.time = Utils.extractDatetime(incident.TimeReported,'HH:mm');

        $scope.incident = incident;

        $scope.closeIncident = function(isValid){
            if(isValid){
                if(!$scope.reason){
                    $modal.open({
                        animation: true,
                        templateUrl: 'reasonEmptyModal.html',
                        controller:'ReasonEmptyModalCtr',
                        size:'large'
                    });
                }else{
                    var info={
                        notes:$scope.reason,
                        incidentNumber : incident.IncidentNumber
                    }
                    $modalInstance.close(info);
                }


            }else{
                $scope.closeIncidentForm.reason.$pristine = false;
            }
        }

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }


    })