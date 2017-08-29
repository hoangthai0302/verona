angular.module('MetronicApp').controller('UserCtrl', function ($rootScope, $state, $scope, $http, $timeout, $cookieStore, $window, logoutService) {
    $scope.validateEmail = function () {
        $("#passwordIsEnter").text("");
        $('#password').css('border', '1px solid #c2cad8');
        $("#emailIsEnter").text("");
        if ($scope.email !== "" || $scope.email !== undefined) {
            $('#email').css('border', '1px solid #c2cad8');
            $scope.accountNotMatch = "";
        }
    };
    $scope.validatePassword = function () {
        $("#passwordIsEnter").text("");
        if ($scope.password !== "" || $scope.password !== undefined) {
            $('#password').css('border', '1px solid #c2cad8');
        }
    };
    // Login function
    $scope.login = function () {
        $state.go('app.incident');
        //if ( !$scope.email )
        //{
        //    $( '#email' ).css( 'border', '1px solid red' );
        //    $( '#email' ).focus();
        //    $( "#emailIsEnter" ).text( USERNAME_EMPTY );
        //    return;
        //} else
        //{
        //    $( '#email' ).css( 'border', '1px solid #c2cad8' );
        //    $( "#emailIsEnter" ).text( "" );
        //}
        //if ( !$scope.password )
        //{
        //    $( '#password' ).css( 'border', '1px solid #e43a45' );
        //    $( '#password' ).focus();
        //    $( "#passwordIsEnter" ).text( PASSWORD_EMPTY );
        //    return;
        //} else
        //{
        //    $( '#password' ).css( 'border', '1px solid #c2cad8' );
        //    $( "#passwordIsEnter" ).text( "" );
        //}
        //var user = {
        //    name: $scope.email,
        //    password: $scope.password
        //}
        //var loginUrl = SERVER_API + "user/login";
        //$http.post( loginUrl, user, { withCredentials: true } )
        //    .success( function ( response )
        //    {
        //        if ( response.status == STATUS_SUCCESS )
        //        {
        //            $state.go( 'app.resourcePlanning' );
        //            localStorage.setItem( "USERTOKEN", response.data.mail );
        //        } else if ( response.status == STATUS_ERROR )
        //        {
        //            $scope.accountNotMatch = "The username or password entered is not correct";
        //        } else
        //        {
        //            $( '#isServerError' ).text( SERVER_ERROR );
        //            $( '#emailOrPasswordInvalid' ).text( '' );
        //        }
        //    } ).error( function ( err )
        //    {
        //        $( '#emailOrPasswordInvalid' ).text( '' );
        //        $( '#isServerError' ).text( SERVER_ERROR );
        //    } );
    };

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});