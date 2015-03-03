(function() {

    var fileController = function ($scope, $rootScope, $log, $http, apiFactory, appSettings) {

        $scope.appSettings = appSettings;
        $scope.sortBy = 'name';
        $scope.reverse = false;
        $scope.files = {};

        function getFiles() {
            $scope.files={};

            apiFactory.getUploadedFiles()
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

        getFiles();

        $scope.doSort = function(propName) {
            $scope.sortBy = propName;
            $scope.reverse = !$scope.reverse;
        };

    };

    fileController.$inject = ['$scope','$rootScope', '$log', '$http', 'apiFactory', 'appSettings'];

    angular.module('harvesterApp')
        .controller('fileController', fileController);

}());