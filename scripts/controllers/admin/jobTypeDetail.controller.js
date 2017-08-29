angular.module('MetronicApp').controller('JobTypeDetailCtrl',
    function($state, $scope, $modalInstance,jobType, Utils, dataService) {

        $scope.jobType = jobType;

        $scope.priorities= [0,1,2,3,4,5,6,7,8,9];
        $scope.newPriority = 5;
        $scope.newSlaTime = jobType.SlaTime;
        
        $scope.updateJobType = function(){

            var info = {
                "JobTypeCode": jobType.JobTypeCode,
                "Priority": $scope.newPriority,
                "SlaTime": $scope.newSlaTime,
                "UpdatedBy":'Admin'
            }

            if(!$scope.newSlaTime || $scope.newSlaTime == 0){
                $scope.openModal('Please enter new SLA!');
            }else{
                dataService.updateJobType(info).then(function(response){
                    //update client data
                    if(response.Status == STATUS_SUCCESS){
                        $scope.selectedJobType.SlaTime = info.SlaTime
                        $scope.selectedJobType.Priority = $scope.newPriority;
                    }
                })

                $modalInstance.close();
            }

        }



        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }

    })