(function() {

    var fileController = function ($scope, $rootScope, $location, $log, $http, apiFactory, appSettings) {

        $scope.appSettings = appSettings;
        $scope.sortBy = 'name';
        $scope.reverse = false;
        $scope.fpath = $location.path();
        $scope.fileObj = {};

        function changeLocation (url, forceReload) {
            $scope = $scope || angular.element(document).scope();
            if(forceReload || $scope.$$phase) {
                window.location = url;
            }
            else {
                //only use this if you want to replace the history stack
                //$location.path(url).replace();

                //this this if you want to change the URL and add it to the history stack
                $location.path(url);
                $scope.$apply();
            }
        };

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
                case '/uploads' :
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

        $scope.loadFile = function(path) {
            apiFactory.loadFile(path)
                .success(function (Data) {
                    changeLocation('/',false);
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