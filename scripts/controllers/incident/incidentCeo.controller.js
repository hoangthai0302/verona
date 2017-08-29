angular.module('MetronicApp').controller('IncidentCeoModalCtrl',
    function($state, $scope, $modalInstance,incident,ceos,Utils, dataService,$rootScope) {
        $scope.timeReported = Utils.extractDatetime(incident.TimeReported);



        $scope.incident = incident;
        $scope.ceos = ceos;

        $scope.assignCeo = function(){
            if(!$scope.selectedCeo){
                $scope.openModal(MESSAGES.NO_CEO_SELECTED);
            }else{

                var info={
                    ceoCode:$scope.selectedCeo.Code,
                    incidentNumber : incident.IncidentNumber
                }

                dataService.assignCeo(info).then(function(data){
                    //update $rootScope.incidents
                    if(data && data.Data){
                        var ceo = Utils.getCeoByCode(info.ceoCode);
                        if(ceo){
                            $rootScope.selectedIncident.Ceo = ceo.Code;
                            $rootScope.selectedIncident.CeoName = ceo.Name;
                            $rootScope.selectedIncident.JobStatus = 'N';
                            $rootScope.selectedIncident.JobNumber = data.Data.Item1;
                            //todo: backend need to return job number for client to update
                        }

                    }

                })

                $modalInstance.close();
            }
        }

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }

        $scope.selectedCeo = Utils.getCeoByCode(incident.Ceo);

    })