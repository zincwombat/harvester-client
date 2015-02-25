(function() {

    var statsController = function ($scope, $rootScope, $log, $http, apiFactory, ngDialog, appSettings) {

        $scope.sortBy = 'name';
        $scope.reverse = false;
        $scope.appSettings = appSettings;

        function refreshStats() {
            $rootScope.stats_object={};

            apiFactory.getStats()
                .then(
                    function(Data) {
                        $rootScope.stats_object = Data;
                    },
                    function (data,status) {
                        alert('error: ' + status);
                        $log.log(data.error + ' ' + status);
                    }
                );
        }

        function init() {
            apiFactory.tm_start();
            refreshStats();
        }

        init();

        $scope.doSort = function(propName) {
            $scope.sortBy = propName;
            $scope.reverse = !$scope.reverse;
        };

    };

    statsController.$inject = ['$scope','$rootScope', '$log', '$http', 'apiFactory', 'ngDialog','appSettings'];

    angular.module('harvesterApp')
        .controller('statsController', statsController);

}());