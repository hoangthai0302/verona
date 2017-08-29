angular.module('MetronicApp')
    .factory('logoutService', function ($http, $q, $rootScope, $state) {
        return {
            logout: function () {
                var urlLogout = SERVER_API + "/UserAdmin/Logout";
                $http.get(urlLogout, { withCredentials: true }).success(function (rs) {
                    if (rs.Status == 1) {
                        $state.go("core.login");
                    }
                }).error(function (err) {
                    //console.log(err);
                });
            }
        }
    });