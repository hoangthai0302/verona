'use strict';

angular.module('MetronicApp')
    .factory('Utils', function ($rootScope, DateUtils) {
        var Utils = {};

        var _isEmptyObject = function(object) {
            for(var i in object) { return false; }
            return true;
        };

        var _getRandomInt = function(max){
            try{
                max = parseInt(max);
            }catch(ex){ max = 1;}

            return Math.floor(Math.random() * max) + 1
        }

        var _anyFrom = function (arr) {
            if(arr.length == 0){
                return null;
            }

            try{
                return arr[Math.floor(Math.random() * arr.length)];
            }catch(ex){
                //console.log('error getting element from array')
            }

            return null;
        }

        var _extractDatetime = function(timeReported,format){
            if(!timeReported){
                return null;
            }

            var timestamp = timeReported.substring(6, timeReported.length-2);
            try{
                timestamp = parseInt(timestamp);
                timestamp = timestamp/1000;
            }catch(ex){

            }
            if(!format){
                format = DATETIME_FORMAT;
            }
            return moment.unix(timestamp).format(format);
        }

        var _isCodeRed = function(incident){
            if(incident && incident.IncidentTypeName && incident.IncidentTypeName.toUpperCase() == INCIDENT_TYPE.CODE_RED){
                return true;
            }

            return false;
        }

        var _shorten = function(str, maxLength){
            if(!maxLength) maxLength = 50;
            if(str && str.length > maxLength){
                str = str.substring(0,maxLength) + '...';
            }
            return str;
        }


        var _buildIncidentSearchQuery = function(){
            var format = API_DATE_FORMAT;  //backend use this format ??
            var filter = $rootScope.incFilter;

            if(filter.status == FILTER.SELECTED && filter.selectedIncidentNumber){
                return SERVER_API + API.INCIDENT_DETAIL + '?incidentNumber=' + filter.selectedIncidentNumber;

            }

            function getSelectedCeoFilter(){
                if(filter.selectedCEO){
                    return filter.selectedCEO.Code;
                }
                return '';
            }

            if(filter.sortDirection == null){
                filter.sortDirection = true;
            }

            var data = {
                IncidentAll                 :filter.status === FILTER.ALL,
                IncidentClosed              :filter.status === FILTER.CLOSED,
                IncidentNumber              :filter.status === FILTER.SELECTED? filter.selectedIncidentNumber:'',
                Today                       :filter.date === FILTER.TODAY ,
                TimeReportedFrom            :filter.date === FILTER.DATE_RANGE? moment(filter.dateFrom).format(format) :'',
                TimeReportedTo              :filter.date === FILTER.DATE_RANGE? moment(filter.dateTo).format(format) :'',
                VrmAll                      :filter.vrm === FILTER.ALL,
                Vrm                         :filter.vrm === FILTER.SELECTED? filter.selectedVRM:'',
                CeoAll                      :filter.ceo === FILTER.ALL,
                Ceo                         :filter.ceo === FILTER.SELECTED?getSelectedCeoFilter():'',
                PageNumber                  :filter.pageNum || 1,
                PageSize                    :PAGE_SIZE,
                SortColumn                  :filter.sortColumn || 'TimeReported',
                SortAsc                     :filter.sortDirection || false,
            }

            data.Vrm = data.Vrm  || '';

            if(filter.date === FILTER.THIS_MONTH || filter.date == FILTER.THIS_WEEK){
                var dateRange = DateUtils.getDateRangeBaseOnFilter(filter.date, format);
                data.TimeReportedFrom = dateRange.from;
                data.TimeReportedTo = dateRange.to;
            }

            var query = SERVER_API + API.LIST_INCIDENTS + '?';
            var amp = '';

            for(var key in data){
                query += amp + key + '=' + data[key];
                amp = '&';
            }

            return query;

        }
        var _buildJobSearchQuery = function(){
            var format = API_DATE_FORMAT;  //backend use this format ??
            var filter = $rootScope.jobFilter;

            function getSelectedCeoFilter(){
                if(filter.selectedCEO){
                    return filter.selectedCEO.Code;
                }
                return '';
            }

            if(filter.sortDirection == null){
                filter.sortDirection = true;
            }

            var data = {
                Status                      :filter.status || JOB_STATUS.ALL,
                Today                       :filter.date === FILTER.TODAY ,
                TimeReportedFrom            :filter.date === FILTER.DATE_RANGE? moment(filter.dateFrom).format(format) :'',
                TimeReportedTo              :filter.date === FILTER.DATE_RANGE? moment(filter.dateTo).format(format) :'',
                VrmAll                      :filter.vrm === FILTER.ALL,
                Vrm                         :filter.vrm === FILTER.SELECTED? filter.selectedVRM:'',
                PriorityAll                 :filter.priority == FILTER.ALL,
                Priority                    :filter.selectedPriority || '',
                CeoAll                      :filter.ceo === FILTER.ALL,
                Ceo                         :filter.ceo === FILTER.SELECTED? getSelectedCeoFilter():'',
                PageNumber                  :filter.pageNum || 1,
                PageSize                    :PAGE_SIZE,
                SortColumn                  :filter.sortColumn || 'TimeReported',
                SortAsc                     :filter.sortDirection || false,
            }

            data.Vrm = data.Vrm  || '';

            if(filter.date === FILTER.THIS_MONTH || filter.date == FILTER.THIS_WEEK){
                var dateRange = DateUtils.getDateRangeBaseOnFilter(filter.date, format);
                data.TimeReportedFrom = dateRange.from;
                data.TimeReportedTo = dateRange.to;
            }

            var query = SERVER_API + API.LIST_JOBS + '?';
            var amp = '';

            for(var key in data){
                query += amp + key + '=' + data[key];
                amp = '&';
            }
            return query;

        }

        var _getPager = function (totalItems, currentPage, pageSize) {
            // default to first page
            currentPage = currentPage || 1;

            // default page size is 10
            pageSize = pageSize || 10;

            // calculate total pages
            var totalPages = Math.ceil(totalItems / pageSize);

            var startPage, endPage;
            if (totalPages <= 10) {
                // less than 10 total pages so show all
                startPage = 1;
                endPage = totalPages;
            } else {
                // more than 10 total pages so calculate start and end pages
                if (currentPage <= 6) {
                    startPage = 1;
                    endPage = 10;
                } else if (currentPage + 4 >= totalPages) {
                    startPage = totalPages - 9;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - 5;
                    endPage = currentPage + 4;
                }
            }

            // calculate start and end item indexes
            var startIndex = (currentPage - 1) * pageSize;
            var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

            var pages = [];
            for(var i = startPage; i < endPage + 1; i++){
                pages.push(i);
            }
            // return object with all pager properties required by the view
            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        }

        var _getCeoByCode  = function(code){
            if($rootScope.ceos && code){
                for(var i = 0; i < $rootScope.ceos.length; i++){
                    var c = $rootScope.ceos[i];
                    if(c.Code == code){
                        return c;
                    }
                }
            }

            return null;
        }

        var _getJobtypeByCode  = function(code){
            if($rootScope.jobTypes && code){
                for(var i = 0; i < $rootScope.jobTypes.length; i++){
                    var t = $rootScope.jobTypes[i];
                    if(t.JobTypeCode == code){
                        return t;
                    }
                }
            }

            return null;
        }

        var _getVehicleMakeByNumber  = function(number){
            if($rootScope.vehicleMakes && number){
                for(var i = 0; i < $rootScope.vehicleMakes.length; i++){
                    var m = $rootScope.vehicleMakes[i];
                    if(m && m.MakeNumber == number){
                        return m;
                    }
                }
            }

            return null;
        }

        var _getVehicleColorByCode  = function(code){
            if($rootScope.vehicleColors && code){
                for(var i = 0; i < $rootScope.vehicleColors.length; i++){
                    var c = $rootScope.vehicleColors[i];
                    if(c && c.ColourNumber == code){
                        return c;
                    }
                }
            }

            return null;
        }

        Utils.isEmptyObject = _isEmptyObject;
        Utils.getRandomInt = _getRandomInt;
        Utils.anyFrom = _anyFrom;
        Utils.isCodeRed = _isCodeRed;
        Utils.buildIncidentSearchQuery = _buildIncidentSearchQuery;
        Utils.buildJobSearchQuery = _buildJobSearchQuery;
        Utils.extractDatetime = _extractDatetime;
        Utils.getPager = _getPager;
        Utils.getCeoByCode = _getCeoByCode;
        Utils.getJobtypeByCode = _getJobtypeByCode;
        Utils.getVehicleMakeByNumber = _getVehicleMakeByNumber;
        Utils.getVehicleColorByCode = _getVehicleColorByCode;

        Utils.shorten = _shorten;

        return Utils;
})
    .factory('DomUtils', function () {
        var DomUtils = {};

        return DomUtils;
})  .factory('DateUtils', function () {
        var DateUtils = {};

        var _getFirstDayOfThisMonth = function(format){
            format = format || DATE_FORMAT;
            var date = new Date(),
                y = date.getFullYear(),
                m = date.getMonth();
            var firstDay = new Date(y, m, 1);
            return moment(firstDay).format(format);
        }

        var _getLastDayOfThisMonth = function(format){
            format = format || DATE_FORMAT;
            var date = new Date(),
                y = date.getFullYear(),
                m = date.getMonth();
            var lastDay = new Date(y, m + 1, 0);
            return moment(lastDay).format(format);
        }

        var _getFirstDayOfThisWeek = function(format){
            format = format || DATE_FORMAT;
            return moment().startOf('isoweek').format(format);
        }

        var _getLastDayOfThisWeek = function(format){
            format = format || DATE_FORMAT;
            return moment().endOf('isoweek').format(format);
        }

        var _DDMMYY_toDateObject = function(ddmmyyyy){

            var from = ddmmyyyy.split("/");
            return new Date(from[2], from[1] - 1, from[0]);
        }

        var _getDateRangeBaseOnFilter = function(filterDate,format){
            format = format || DATE_FORMAT;
            if(filterDate === FILTER.THIS_MONTH){
                return {
                    from:DateUtils.getFirstDayOfThisMonth(format),
                    to:DateUtils.getLastDayOfThisMonth(format)
                }
            }

            if(filterDate === FILTER.THIS_WEEK){
                return {
                    from:DateUtils.getFirstDayOfThisWeek(format),
                    to:DateUtils.getLastDayOfThisWeek(format)
                }
            }

            return null;
        }



        DateUtils.getFirstDayOfThisMonth = _getFirstDayOfThisMonth;
        DateUtils.getLastDayOfThisMonth = _getLastDayOfThisMonth;
        DateUtils.getFirstDayOfThisWeek = _getFirstDayOfThisWeek;
        DateUtils.getLastDayOfThisWeek = _getLastDayOfThisWeek;

        DateUtils.DDMMYY_toDateObject = _DDMMYY_toDateObject;

        DateUtils.getDateRangeBaseOnFilter = _getDateRangeBaseOnFilter;

        return DateUtils;
});
