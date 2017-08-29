angular.module('MetronicApp').controller('HeaderController', function ($rootScope, $scope, $http, $timeout, $state, logoutService) {
    $scope.$on('$viewContentLoaded', function () { });

    $scope.openModalLogout = function () {
        $("#modalConfirmLogout").modal("show");
    }
    $scope.logout = function () {
        $("#modalConfirmLogout").modal("hide");
        localStorage.setItem("USERTOKEN", "");

        setTimeout(function () {
            $state.go("core.login");
        }, 1000);
    }
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});