(function() {

    var apiController = function ($scope, $rootScope, $log, $http, $interval, apiFactory, ngDialog, appSettings) {

        $scope.sortBy = 'name';
        $scope.reverse = false;
        $scope.status = {};
        $scope.status_array=[];
        $scope.menu_options=[];
        $scope.stats_array=[];
        $scope.options_array=[];
        $scope.upload_array=[];
        $scope.appSettings = appSettings;
        $scope.job = {};
        $scope.invokeObj = {};

        //$scope.$on('currentState', function(event,args) {
        //    alert("handled currentState update");
        //    refreshMenu();
        //});


        $scope.$on('refresh', function(event, args) {
            refreshMenu();
        });

        $scope.$on('formData', function(event, args) {
            doInvoke($scope.invokeObj,args.formData);
        });

        $scope.$on('filterData', function(event, args) {
            doInvoke($scope.invokeObj,args);
        });

        $scope.$on('serializerData', function(event, args) {
            doInvoke($scope.invokeObj,args);
        });

        $scope.$on('analysisData', function(event, args) {
            doInvoke($scope.invokeObj,args);
        });

        $scope.$on('agentsData', function(event, args) {
            alert("handling emit!");
            doInvoke($scope.invokeObj,args);
        });

        $scope.invoke = function(Obj) {
            $scope.invokeObj=Obj;
            var Op=Obj.operation;
            var Verb=Obj.verb;

            switch (Op) {

                case '/api/op/main' :
                    refreshMenu();
                    apiFactory.updateRunState();
                    updateMetrics();
                    getJobDetail();
                    break;

                case '/api/op/purge' :
                    $scope.job.description='';
                    doInvoke(Obj,[]);

                    break;

                case '/api/op/start' :
                    doInvoke(Obj,[]);
                    apiFactory.tm_start();
                    break;

                case '/api/op/stop' :
                    doInvoke(Obj,[]);

                    break;

                case '/api/op/data' :
                    ngDialog.open({
                        template: 'app/views/loadData.html',
                        className: 'ngdialog-theme-default',
                        scope : $scope});
                    break;

                case '/api/op/configure' :
                    ngDialog.open({
                        template: 'app/views/setAnalysis.html',
                        className: 'ngdialog-theme-default',
                        scope : $scope});
                    break;

                case '/api/op/filter' :
                    ngDialog.open({
                        template: 'app/views/setFilter.html',
                        className: 'ngdialog-theme-default',
                        scope : $scope});
                    break;

                case '/api/op/agents' :
                    ngDialog.open({
                        template: 'app/views/agents.html',
                        className: 'ngdialog-theme-default',
                        scope : $scope});
                    break;

                case '/api/op/serializer' :
                    ngDialog.open({
                        template: 'app/views/setSerializer.html',
                        className: 'ngdialog-theme-default',
                        scope : $scope});
                    break;

                default:
                    alert("unhandled: " + Op + " verb:" + Verb);

            }
        };

        $scope.setJobDescription = function(JobDescription) {
            apiFactory.setJobDescription(JobDescription);
        };


        function doInvoke(Obj,Payload) {
            var promise = apiFactory.invoke(Obj.operation,Obj.verb,{},Payload);

            promise.then(
                function(Data) {
                    apiFactory.updateRunState();
                    refreshMenu();
                    getJobDetail();
                    updateMetrics();
                },
                function() {
                    alert("error has occurred");
                }
            )
        };

        function currentState() {
            apiFactory.getStatus()
                .then(
                    function(Data) {
                        $scope.raw = Data;
                        $scope.statsObj = Data;
                        $scope.status_array = [];

                        angular.forEach(Data, function (value,key) {
                            $scope.status_array.push({key:key,value:value});
                        }, $scope.raw);
                    },
                    function (data,status,headers,config) {
                        alert('error: ' + status);
                        $log.log(data.error + ' ' + status);
                    }
                );
        };

        function updateMetrics() {
            apiFactory.getStats()
                .then(
                function (Data) {
                    $rootScope.stats_object = Data;
                },
                function (data,status,headers,config) {
                    alert('error: ' + status);
                }
            )
        };



        function refreshMenu() {
            currentState();
            apiFactory.getMenuOptions()
                .then(
                    function (Data) {
                        $scope.isUpload=false;
                        $scope.upload_array=[];
                        $scope.options_array=[];
                        $scope.menu_options = Data;

                        angular.forEach(Data, function (obj) {
                            if (obj.label=="Import File") {
                                $scope.upload_array.push(obj);
                            }
                            else {
                                $scope.options_array.push(obj);
                            }
                        }, $scope.menu_options);
                    },
                    function (data,status,headers,config) {
                        alert('error: ' + status);
                        $log.log(data.error + ' ' + status);
                    });
        };

        function getJobDetail() {
            apiFactory.getJobDescription()
                .then(
                function(Data) {
                    $scope.job.description=Data.jobdesc;
                    $scope.job.analysis_desc=Data.analysis_desc;
                    $scope.job.serializer_desc=Data.serializerDesc;
                }),
                function (data,status,headers,config) {
                    alert('error: ' + status);
                    $log.log(data.error + ' ' + status);
                }
        };

        function init() {
            //alert("called init() in apiController.js");
            apiFactory.getState();
            apiFactory.updateRunState();
            getJobDetail();
            refreshMenu();
        }

        init();

        $scope.doSort = function(propName) {
            $scope.sortBy = propName;
            $scope.reverse = !$scope.reverse;
        };

    };

    apiController.$inject = ['$scope', '$rootScope', '$log', '$http', '$interval', 'apiFactory', 'ngDialog','appSettings'];

    angular.module('harvesterApp')
        .controller('apiController', apiController);

}());