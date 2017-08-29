/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
MetronicApp.directive('ngSpinnerBar', ['$rootScope',
    function ($rootScope) {
        return {
            link: function (scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function () {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function () {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    // Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu

                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function () {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function () {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
MetronicApp.directive('a', function () {
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function (e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
MetronicApp.directive('dropdownMenuHover', function () {
    return {
        link: function (scope, elem) {
            elem.dropdownHover();
        }
    };
});

MetronicApp.directive('customDateTimepicker', function ($compile) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {


            element.datetimepicker({
                debug: false,
                format: 'DD/MM/YYYY HH:mm',
                ignoreReadonly: true,
                //useCurrent:false
            }).on('dp.change', function (e) {
                ngModelCtrl.$setViewValue(e.date);
                scope.$apply();
            }).on('dp.show', function (e) {

                /*var job_detail_time_created = $('#job_detail_time_created').val();
                if(job_detail_time_created){
                    var timecreated = moment(job_detail_time_created, 'DD/MM/YYYY HH:mm');
                    $('#job_detail_slatime')
                        .data("DateTimePicker")
                        .minDate(timecreated);

                    var minHour = timecreated.hour();
                    var minMinutes = timecreated.minutes();

                    $('#job_detail_slatime').data("DateTimePicker").disabledTimeIntervals([
                        [moment().hour(0), moment().hour(minHour).minutes(minMinutes)]
                    ]);
                }*/

            })

            ngModelCtrl.$formatters.push(function(value){
                if(value){
                    value = moment(value).format('DD/MM/YYYY HH:mm')
                }
                return value;
            });


        }
    };
});


MetronicApp.directive('customDatepicker', function ($compile) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
                element.datetimepicker({
                    debug: false,
                    format: 'DD/MM/YYYY',
                    ignoreReadonly: true,
                    maxDate: moment()
                }).on('dp.change', function (e) {
                    var target = e.target;
                    if(target.id == 'incDateTo'){
                        $('#incDateFrom').data("DateTimePicker").maxDate(e.date);
                    }
                    if(target.id == 'jobDateTo'){
                        $('#jobDateFrom').data("DateTimePicker").maxDate(e.date);
                    }



                    ngModelCtrl.$setViewValue(e.date);
                    scope.$apply();
                })

                ngModelCtrl.$formatters.push(function(value){
                    if(value){
                        value = moment(value).format('DD/MM/YYYY')
                    }
                    return value;
                });


        }
    };
});

MetronicApp.directive('dependOn', function() {
    return {
        require: 'ngModel',
        scope:{
          dependOn:'='
        },
        link: function(scope, element, attr, ngModel) {

            if (!ngModel) return;

            if(element){
                var el = angular.element(element)[0];
                $(el).click(function(){
                    $(this).select();
                })

            }

            ngModel.$parsers.unshift(function(viewValue) {

                var reg = /^\d*$/;


                function test(viewValue){
                    try{

                            viewValue = parseInt(viewValue);

                            if(viewValue >= scope.dependOn || viewValue < 1){

                                return true;
                            }else{
                                return false;
                            }
                    }catch (ex){

                    }
                    return false;
                }

                if(!reg.test(viewValue) || test(viewValue)){


                    var currentValue = ngModel.$modelValue;
                    ngModel.$setViewValue(currentValue);
                    ngModel.$render();
                    return currentValue;
                }else{
                    return viewValue;
                }


            });

        }
    };
});

MetronicApp.directive('longitude', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {

            if (!ngModel) return;

            ngModel.$parsers.unshift(function(viewValue) {

                var reg = /^[+-]?(\d+\.?\d*)?$/;


                function test(viewValue){
                    try{
                        if(viewValue != '-' && viewValue != '+'){

                            viewValue = parseFloat(viewValue);

                            if(viewValue > 180 || viewValue < -180){

                                return true;
                            }else{
                                return false;
                            }
                        }
                    }catch (ex){

                    }
                    return false;
                }

                if(!reg.test(viewValue) || test(viewValue)){


                    var currentValue = ngModel.$modelValue;
                    ngModel.$setViewValue(currentValue);
                    ngModel.$render();
                    return currentValue;
                }else{


                    return viewValue;
                }


            });

        }
    };
});

MetronicApp.directive('latitude', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {

            if (!ngModel) return;

            ngModel.$parsers.unshift(function(viewValue) {

                var reg = /^[+-]?(\d+\.?\d*)?$/;


                function test(viewValue){
                    try{
                        if(viewValue != '-' && viewValue != '+'){

                            viewValue = parseFloat(viewValue);

                            if(viewValue > 90 || viewValue < -90){

                                return true;
                            }else{
                                return false;
                            }
                        }
                    }catch (ex){

                    }
                    return false;
                }

                if(!reg.test(viewValue) || test(viewValue)){


                    var currentValue = ngModel.$modelValue;
                    ngModel.$setViewValue(currentValue);
                    ngModel.$render();
                    return currentValue;
                }else{


                    return viewValue;
                }


            });

        }
    };
});

MetronicApp.directive('numericFloat', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
            var view_value;
            ngModel.$parsers.push(function(value){

                var return_value;

                var reg = /^[+-]?(\d+\.?\d*)?$/;



                    if(!reg.test(value)){
                        return_value = view_value;
                        ngModel.$setViewValue(view_value);
                        ngModel.$render();
                        ngModel.$setValidity('is_valid', false);
                    } else {

                        return_value = value;
                        view_value = return_value;
                        ngModel.$setValidity('is_valid', true);
                    }



                return return_value;
            });
        }
    };
});

MetronicApp.directive('positiveNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
            var view_value;
            ngModel.$parsers.push(function(value){

                var return_value;

                var reg = /^\d*$/;



                if(!reg.test(value)){
                    return_value = view_value;
                    ngModel.$setViewValue(view_value);
                    ngModel.$render();
                    ngModel.$setValidity('is_valid', false);
                } else {

                    return_value = value;
                    view_value = return_value;
                    ngModel.$setValidity('is_valid', true);
                }



                return return_value;
            });


        }
    };
});

MetronicApp.directive('yesNo', function($timeout) {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
            var reg = /^[yYnN]?$/;

            if (!ngModel) return;

            if(element){
                var el = angular.element(element)[0];
                $(el).click(function(){
                    $(this).select();
                })

            }

            ngModel.$parsers.unshift(function(viewValue) {
                if(!reg.test(viewValue)) {
                    var currentValue = ngModel.$modelValue;
                    ngModel.$setViewValue(currentValue.toUpperCase());
                    ngModel.$render();
                    return currentValue.toUpperCase();
                }
                else
                {
                    if(viewValue == ''){
                        viewValue = 'N'
                        $timeout(function(){
                            ngModel.$setViewValue('N');
                            ngModel.$render();
                            return viewValue.toUpperCase();

                        },350)
                    }else{
                        ngModel.$setViewValue(viewValue.toUpperCase());
                        ngModel.$render();
                        return viewValue.toUpperCase();
                    }
                }
            });

            ngModel.$formatters.push(function(value){
                if(value){
                    value = value.toUpperCase();
                }
                return value;
            });

        }
    };
});

MetronicApp.directive('upperCase', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {

            if (!ngModel) return;

            ngModel.$parsers.unshift(function(viewValue) {

                if(viewValue) {
                    viewValue = viewValue.toUpperCase();

                    ngModel.$setViewValue(viewValue);
                    ngModel.$render();
                }
                return viewValue;
            });

            ngModel.$formatters.push(function(value){
                if(value){
                    value = value.toUpperCase();
                }
                return value;
            });

        }
    };
});

MetronicApp.directive('maxLength50', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {

            if (!ngModel) return;

            ngModel.$parsers.unshift(function(viewValue) {
                if(viewValue && viewValue.length > 50) {
                    var currentValue = ngModel.$modelValue;
                    ngModel.$setViewValue(currentValue);
                    ngModel.$render();
                    return currentValue;
                }
                else
                {
                    return viewValue;
                }
            });

        }
    };
});

MetronicApp.directive('maxLength', function() {
    return {
        require: 'ngModel',
        scope:{
          maxLength:'='
        },
        link: function(scope, element, attr, ngModel) {

            if (!ngModel) return;

            ngModel.$parsers.unshift(function(viewValue) {
                if(viewValue && viewValue.length > scope.maxLength) {
                    var currentValue = ngModel.$modelValue;
                    ngModel.$setViewValue(currentValue);
                    ngModel.$render();
                    return currentValue;
                }
                else
                {
                    return viewValue;
                }
            });

        }
    };
});


MetronicApp.directive('maxLengthReason', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {

            if (!ngModel) return;

            ngModel.$parsers.unshift(function(viewValue) {
                if(viewValue && viewValue.length > 100) {
                    var currentValue = ngModel.$modelValue;
                    ngModel.$setViewValue(currentValue);
                    ngModel.$render();
                    return currentValue;
                }
                else
                {
                    return viewValue;
                }
            });

        }
    };
});

MetronicApp.directive('maxLengthNotes', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {

            if (!ngModel) return;

            ngModel.$parsers.unshift(function(viewValue) {
                if(viewValue && viewValue.length > 200) {
                    var currentValue = ngModel.$modelValue;
                    ngModel.$setViewValue(currentValue);
                    ngModel.$render();
                    return currentValue;
                }
                else
                {
                  return viewValue;
                }
            });

        }
    };
});