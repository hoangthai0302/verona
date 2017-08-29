angular.module( 'MetronicApp' ).service( 'dataService',  function ( $http, $q, Utils,$rootScope )
{
    var service = {};

    service.loadIncidents = function ()
    {

        var deferred = $q.defer();

        var url = Utils.buildIncidentSearchQuery();
        $http.get( url )
            .success( function ( response )
            {
                if(url.indexOf(API.INCIDENT_DETAIL) == -1){
                    $rootScope.incidents = response.Data.Item2;
                    var total = response.Data.Item1 || 0;

                    deferred.resolve( total);
                }else{
                    $rootScope.incidents = [response.Data];
                    var total = 1;
                    deferred.resolve( total);
                }
            } ).error( function ( err )
            {
                deferred.reject( err );
            } );
        return deferred.promise;
    }

    service.insertIncident = function(info){
        var deferred = $q.defer();

        var data = $.param({
            "IncidentType": info.jobTypeCode,
            "Vrm": info.vrm,
            "VehicleMake": info.makeNumber,
            "VehicleColour": info.colorNumber,
            "Location": info.location,
            "Latitude": info.latitude,
            "Longitude": info.longtitude,
            "Notes": info.notes,
            "TimeReported": info.timeReported,
            "UpdatedBy": info.updatedBy
        });

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        var url = SERVER_API + API.INSERT_INCIDENT;

        $http.post(url, data, config)
            .success(function (data, status, headers, config) {
                deferred.resolve( data);
            }).error( function ( err )
        {
            deferred.reject( err );
        } );
        return deferred.promise;
    }

    service.updateIncident = function(info){
        var deferred = $q.defer();

        var data = $.param(info);

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        var url = SERVER_API + API.UPDATE_INCIDENT;

        $http.put(url, data, config)
            .success(function (data, status, headers, config) {
                deferred.resolve( data);
            }).error( function ( err )
            {
                deferred.reject( err );
            } );

        return deferred.promise;

    }

    service.closeIncident = function(info){
        var deferred = $q.defer();

        var data = $.param(info);

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        var url = SERVER_API + API.CLOSE_INCIDENT;

        $http.put(url, data, config)
            .success(function (data, status, headers, config) {
                deferred.resolve( data);
            }).error( function ( err )
        {
            deferred.reject( err );
        } );

        return deferred.promise;

    }

    service.loadIncidentDetail = function(incidentNumber){
        var deferred = $q.defer();

        var url = SERVER_API + API.INCIDENT_DETAIL + '?incidentNumber=' + incidentNumber;
        $http.get( url )
            .success( function ( response )
            {
                deferred.resolve( response.Data);
            } ).error( function ( err )
        {
            deferred.reject( err );
        } );
        return deferred.promise;
    }

    service.loadCEOs = function ()
    {
        if(!$rootScope.ceos){
            var url = SERVER_API + API.LIST_CEO;
            $http.get(url)
                .success( function ( response )
                {
                    $rootScope.ceos = response.Data;
                } ).error( function ( err )
                {
                } );
        }
    }

    service.assignCeo = function (info)
    {
        var deferred = $q.defer();
        var data = $.param({
            "incidentNumber": info.incidentNumber,
            "ceoCode": info.ceoCode
        });

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        var url = SERVER_API + API.ASSIGN_CEO;

        $http.post(url, data, config)
            .success(function (data, status, headers, config) {
                deferred.resolve( data);
            }).error( function ( err )
            {
                deferred.reject( err );
            } );
        return deferred.promise;
    }

    service.loadVehicleMakes = function ()
    {
        if(!$rootScope.vehicleMakes){
            var url = SERVER_API + API.LIST_VEHICLE_MAKE;
            $http.get(url)
                .success( function ( response )
                {
                    $rootScope.vehicleMakes = response.Data;
                } ).error( function ( err )
                {
                } );
        }
    }

    service.loadVehicleColors = function ()
    {
        if(!$rootScope.vehicleColors){
            var url = SERVER_API + API.LIST_VEHICLE_COLOR;
            $http.get( url )
                .success( function ( response )
                {
                    $rootScope.vehicleColors = response.Data;
                } ).error( function ( err )
                {
                } );
        }
    }

    service.loadJobTypes = function ()
    {
        var deferred = $q.defer();

        if(!$rootScope.jobTypes){
            var url = SERVER_API + API.LIST_JOB_TYPE;
            $http.get( url )
                .success( function ( response )
                {
                    $rootScope.jobTypes = response.Data || [];
                    var total = response.Data.length;

                    deferred.resolve( total);
                } ).error( function ( err )
                {
                    deferred.reject( err );
                } );
        }else{
            var total = $rootScope.jobTypes.length;
            deferred.resolve( total);
        }

        return deferred.promise;
    }

    service.loadJobTypeDetail = function (code)
    {
        var deferred = $q.defer();

        var url = SERVER_API + API.GET_JOB_DETAILED + '?jobTypeCode=' + code;
        $http.get( url )
            .success( function ( response )
            {

                deferred.resolve( response.Data);
            } ).error( function ( err )
        {
            deferred.reject( err );
        } );


        return deferred.promise;
    }

    service.updateJobType = function(info){
        var deferred = $q.defer();

        var data = $.param(info);

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        var url = SERVER_API + API.UPDATE_JOB_DETAILED;

        $http.put(url, data, config)
            .success(function (data, status, headers, config) {
                deferred.resolve( data);
            }).error( function ( err )
        {
            deferred.reject( err );
        } );

        return deferred.promise;

    }

    ///==================JobQueue===============///

    service.loadJobs = function ()
    {

        var deferred = $q.defer();

        var url = Utils.buildJobSearchQuery();
        $http.get( url )
            .success( function ( response )
            {
                $rootScope.jobs = response.Data.Item2;
                var total = response.Data.Item1 || 0;

                deferred.resolve( total);

            } ).error( function ( err )
        {
            deferred.reject( err );
        } );
        return deferred.promise;
    }


    service.updateJobQueue = function(info ){

        var deferred = $q.defer();

        var data = $.param(info);



        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        var url = SERVER_API + API.JOB_QUEUE_UPDATE;

        $http.put(url, data, config)
            .success(function (data, status, headers, config) {
                deferred.resolve( data);
            }).error( function ( err )
        {
            deferred.reject( err );
        } );

        return deferred.promise;

    }

    service.cancelJobQueue = function(info ){

        var deferred = $q.defer();

        var data = $.param(info);

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        var url = SERVER_API + API.JOB_QUEUE_CANCEL;

        $http.put(url, data, config)
            .success(function (data, status, headers, config) {
                deferred.resolve( data);
            }).error( function ( err )
        {
            deferred.reject( err );
        } );

        return deferred.promise;

    }

    service.rejectJobQueue = function(info ){

        var deferred = $q.defer();

        var data = $.param(info);

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        var url = SERVER_API + API.JOB_QUEUE_REJECT;

        $http.put(url, data, config)
            .success(function (data, status, headers, config) {
                deferred.resolve( data);
            }).error( function ( err )
        {
            deferred.reject( err );
        } );

        return deferred.promise;

    }

    service.completeJobQueue = function(info ){

        var deferred = $q.defer();

        var data = $.param(info);

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        var url = SERVER_API + API.JOB_QUEUE_COMPLETE;

        $http.put(url, data, config)
            .success(function (data, status, headers, config) {
                deferred.resolve( data);
            }).error( function ( err )
        {
            deferred.reject( err );
        } );

        return deferred.promise;

    }

    service.updateJobTask = function(info,jobNumber ){

        var deferred = $q.defer();

        var data = $.param({
            jobTaskList:info
        });

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        var url = SERVER_API + API.UPDATE_JOB_TASK + '?jobNumber=' + jobNumber;

        $http.put(url, data, config)
            .success(function (data, status, headers, config) {
                deferred.resolve( data);
            }).error( function ( err )
        {
            deferred.reject( err );
        } );

        return deferred.promise;

    }

    ///==================Admin===============///

    service.getRejectionReasons = function(sortColumn, pageNum, pageSize, sortDesc){
        var deferred = $q.defer();

        var url = SERVER_API + API.LIST_REJECTION_REASON + '?PageNumber=' + pageNum + '&PageSize=' + pageSize + '&SortColumn=' + sortColumn + '&SortAsc=' + sortDesc;
        $http.get( url )
            .success( function ( response )
            {
                var items = response.Data.Item2 || [];
                var total = response.Data.Item1 || 0;

                deferred.resolve( {
                    items:items,
                    total:total
                });

            } ).error( function ( err )
        {
            deferred.reject( err );
        } );
        return deferred.promise;
    }

    service.addRejectionReason = function(description){
        var deferred = $q.defer();

        var data = $.param({
            "Description": description,
            "UpdatedBy": 'Harrison'
        });

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        var url = SERVER_API + API.ADD_REJECTION_REASON;

        $http.post(url, data, config)
            .success(function (data, status, headers, config) {
                deferred.resolve( data);
            }).error( function ( err )
        {
            deferred.reject( err );
        } );
        return deferred.promise;
    }

    service.updateReason = function (reasonNumber, newDesct,updatedBy)
    {
        var deferred = $q.defer();

        var data = $.param({
            "Description": newDesct,
            "UpdatedBy": updatedBy,
            "ReasonNumber": reasonNumber
        });

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        var url = SERVER_API + API.UPDATE_REASON ;

        $http.put( url, data, config )
            .success( function ( response )
            {
                deferred.resolve();
            } ).error( function ( err )
        {
            deferred.reject( err );
        } );

        return deferred.promise;
    }

    service.deleteReason = function (reasonNumber)
    {
        var deferred = $q.defer();
        var url = SERVER_API + API.DELETE_REASON + '?reasonNumber=' + reasonNumber;

        $http.delete( url )
            .success( function ( response )
            {
                deferred.resolve();
            } ).error( function ( err )
        {
            deferred.reject( err );
        } );

        return deferred.promise;
    }

    service.viewTaskList = function(jobTypeCode){
        var deferred = $q.defer();

        var url = SERVER_API + API.VIEW_TASKLIST + '?jobTypeCode=' + jobTypeCode;
        $http.get( url )
            .success( function ( response )
            {
                var result = response.Data || [];

                deferred.resolve( result);

            } ).error( function ( err )
        {
            deferred.reject( err );
        } );
        return deferred.promise;
    }

    service.updateTaskList = function(info){
        var deferred = $q.defer();

        var data = $.param(info);

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        var url = SERVER_API + API.UPDATE_TASKLIST;

        $http.put(url, data, config)
            .success(function (data, status, headers, config) {
                deferred.resolve( data);
            }).error( function ( err )
        {
            deferred.reject( err );
        } );

        return deferred.promise;

    }


    service.getJobQueueDetail = function(jobNumber){
        var deferred = $q.defer();

        var url = SERVER_API + API.JOB_QUEUE_DETAILED + '?jobNumber=' + jobNumber;
        $http.get( url )
            .success( function ( response )
            {
                var result = response.Data ;
                deferred.resolve( result);

            } ).error( function ( err )
        {
            deferred.reject( err );
        } );
        return deferred.promise;
    }

    return service;
} );