(function() {

    var fileController = function ($scope, $rootScope, $location, $log, $http, apiFactory, appSettings) {

        $scope.appSettings = appSettings;
        $scope.sortBy = 'name';
        $scope.reverse = false;
        $scope.fpath = $location.path();
        $scope.fileObj = {};

        function getFiles() {
            $scope.fileObj={};

            switch ($scope.fpath) {
                case '/results' :
                    apiFactory.getResultFiles()
                        .then(
                        function(Data) {
                            $scope.fileObj = Data;
                        },
                        function (data,status) {
                            alert('error: ' + status);
                            $log.log(data.error + ' ' + status);
                        }
                    );
                    break;
                case '/uploaded' :
                    apiFactory.getUploadedFiles()
                        .then(
                        function(Data) {
                            $scope.fileObj = Data;
                        },
                        function (data,status) {
                            alert('error: ' + status);
                            $log.log(data.error + ' ' + status);
                        }
                    );
                    break;
                default:
                    break;
            }
        }

        getFiles();

        $scope.deleteFile = function(path) {
            apiFactory.deleteFile(path)
                .success(function (Data) {
                    getFiles();
                })
                .error(function (data,status,headers,config) {
                    alert('error: ' + status);
                    $log.log(data.error + ' ' + status);
                });

        }

        $scope.doSort = function(propName) {
            $scope.sortBy = propName;
            $scope.reverse = !$scope.reverse;
        };

    };

    fileController.$inject = ['$scope','$rootScope', '$location', '$log', '$http', 'apiFactory', 'appSettings'];

    angular.module('harvesterApp')
        .controller('fileController', fileController);

}());