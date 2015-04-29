(function() {

    var apiController = function (common, $scope, $rootScope, usSpinnerService ,$log, $http, $interval, apiFactory, ngDialog, appSettings) {

        $scope.sortBy = 'name';
        $scope.reverse = false;
        $scope.showConsole = false;
        $scope.status = {};
        $scope.status_array=[];
        $scope.menu_options=[];
        $scope.stats_array=[];
        $scope.options_array=[];
        $scope.upload_array=[];
        $scope.appSettings = appSettings;
        $scope.job = {};
        $scope.invokeObj = {};

        $scope.toggleConsole = function() {
            $scope.showConsole=!$scope.showConsole;
        };

        $rootScope.$on('us-spinner:spin', function(event, key) {
            $scope.spinneractive = true;
        });

        $rootScope.$on('us-spinner:stop', function(event, key) {
            $scope.spinneractive = false;
        });

        $scope.$on('refresh', function(event, args) {
            $log.debug("refresh");
            refreshMenu();
            updateMetrics();
        });

        $scope.$on('formData', function(event, args) {
            $log.debug("formData:",$scope.invokeObj);
            doInvoke($scope.invokeObj,args.formData);
        });

        $scope.$on('filterData', function(event, args) {
            $log.debug("filterData:",$scope.invokeObj);
            doInvoke($scope.invokeObj,args);
        });

        $scope.$on('clearFilters', function(event, args) {
            $log.debug("clearFilters");
            clearFilters();
        });

        $scope.$on('serializerData', function(event, args) {
            $log.debug("serializerData:",$scope.invokeObj);
            doInvoke($scope.invokeObj,args);
        });

        $scope.$on('analysisData', function(event, args) {
            $log.debug("analysisData:",$scope.invokeObj);
            doInvoke($scope.invokeObj,args);
        });

        $scope.$on('agentsData', function(event, args) {
            $log.debug("agentsData");
            doInvoke($scope.invokeObj,args);
        });

        $scope.invoke = function(Obj) {
            $scope.invokeObj=Obj;
            var Op=Obj.operation;
            var Verb=Obj.verb;

            switch (Op) {

                case '/api/op/main' :
                    refreshMenu();
                    //apiFactory.updateRunState();
                    common.updateRunState();
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

        $scope.applyMenuGlyph =  function(MenuOption) {
            switch(MenuOption.tag) {
                case "main" :
                    return "glyphicon glyphicon-home";
                case "import_file" :
                    return "glyphicon glyphicon-import";
                case "purge" :
                    return "glyphicon glyphicon-remove";
                case "analysis" :
                    return "glyphicon glyphicon-wrench";
                case "filter" :
                    return "glyphicon glyphicon-filter";
                case "serializer" :
                    return "glyphicon glyphicon-book";
                case "start" :
                    return "glyphicon glyphicon-play";
                case "stop" :
                    return "glyphicon glyphicon-stop";
                case "suspend" :
                    return "glyphicon glyphicon-pause";
                default :
                    return "glyphicon glyphicon-star";
            }
        };

        $scope.applyRunStateGlyph =  function() {
            if ($rootScope.currentState=='RUNNING') {
                startSpin();
            }
            else {
                stopSpin();
            }
            switch($rootScope.currentState) {
                case "RUNNING" :
                    return "glyphicon glyphicon-refresh";
                case "IDLE" :
                    return "glyphicon glyphicon-star";
                case "COMPLETED" :
                    return "glyphicon glyphicon-ok";
                default :
                    return "glyphicon glyphicon-star";
            }
        };

        $scope.applyButtonClass =  function() {
            if ($rootScope.isComplete) {
                return "x-state btn btn-success btn-block";
            };
            if ($rootScope.currentState=='RUNNING')
                return "x-state btn btn-danger btn-block";
            return "x-state btn btn-primary btn-block";
        };

        function startSpin() {
            if (!$scope.spinneractive) {
                usSpinnerService.spin('spinner-1');
                $scope.startcounter++;
            }
        };

        function stopSpin() {
            if ($scope.spinneractive) {
                usSpinnerService.stop('spinner-1');
            }
        };

        function doInvoke(Obj,Payload) {
            var promise = apiFactory.invoke(Obj.operation,Obj.verb,{},Payload);

            promise.then(
                function(Data) {
                    $log.debug("doInvoke promise:",Data);
                    //apiFactory.updateRunState();
                    common.updateRunState();
                    refreshMenu();
                    getJobDetail();
                    updateMetrics();
                },
                function() {
                    alert("error has occurred");
                }
            )
        };

        function currentConfig() {
            apiFactory.getConfig()
                .then(
                    function(Data) {
                        $scope.raw = Data;
                        $rootScope.config_obj = Data;
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

        function clearFilters() {
            apiFactory.clearFilter()
                // TODO -- return something here !!
                .then ()
        };

        function refreshMenu() {
            currentConfig();
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
                    $scope.job.filter_desc=Data.filterDesc;
                }),
                function (data,status,headers,config) {
                    alert('error: ' + status);
                    $log.log(data.error + ' ' + status);
                }
        };

        function init() {
            //alert("called init() in apiController.js");
            apiFactory.getState();
            //apiFactory.updateRunState();
            common.updateRunState();
            getJobDetail();
            refreshMenu();
        }



        init();

        $scope.doSort = function(propName) {
            $scope.sortBy = propName;
            $scope.reverse = !$scope.reverse;
        };

    };

    apiController.$inject = ['common', '$scope', '$rootScope', 'usSpinnerService', '$log', '$http', '$interval', 'apiFactory', 'ngDialog','appSettings'];

    angular.module('harvesterApp')
        .controller('apiController', apiController);

}());