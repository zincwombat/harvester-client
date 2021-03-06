(function() {
    var apiFactory = function ($http, $q, $log, $rootScope, $interval, appSettings) {

        var factory = {};
        var baseUrl = appSettings.urlbase;
        var apiModule = appSettings.apiModule;
        var currentState = [];
        var TIMER_INTV = 5000;  // milliseconds
        var timerHandle;

        $rootScope.isComplete=false;

        factory.state = function() {
            return currentState;
        }

        function doApi(fn) {
            var deferred = $q.defer();
            $http({
                method  :   'get',
                url     :   baseUrl + '/api/op',
                params  :   {   module   : apiModule,
                                function : fn }
            }).success(function(data) {
                //$log.debug("doApi:success",data);
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                $log.error("doApi:http error: ", data, status, headers, config);
                deferred.reject('Error');
            })
            return deferred.promise;
        }

        function postApi(Path,Data) {
            var deferred = $q.defer();
            $http({
                method  :   'post',
                url     :   baseUrl + '/api/op/' + Path,
                data  :   Data
            }).success(function(data) {
                //$log.debug("postApi:success",data);
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                $log.error("postApi:http error: ", data, status, headers, config);
                deferred.reject('Error')
            })
            return deferred.promise;
        }

        function startTimer() {
            stopTimer();
            $log.info("starting timer");
            timerHandle = $interval(function () {
                    updateState();
                    //updateRunState();
                }, TIMER_INTV, 0);
        };

        function stopTimer() {
            if (angular.isDefined(timerHandle)) {
                $log.info("stopping timer");
                $interval.cancel(timerHandle);
            }
        };

        function isTimerRunning() {
            return (angular.isDefined(timerHandle));
        }


        // this is the call that will set the values in the stats_object in the rootScope
        // the intention is to have this data refreshed on each timeout so that underlying
        // views can update as required

        function updateState() {
            doApi('get_stats')
                .then(
                    function(Data) {
                        $rootScope.stats_object = Data;

                        if ($rootScope.currentState!='RUNNING') {
                            stopTimer();
                        };

                        if ($rootScope.currentState=='RUNNING') {
                            if (!isTimerRunning()) {
                                startTimer();
                            };
                        }
                    },
                    function() {
                        stopTimer();
                    });
        };

        factory.getUploadedFiles = function() {
            return doApi('get_uploadedFiles');
        }

        factory.getResultFiles = function() {
            return doApi('get_resultFiles');
        }

        factory.deleteFile = function(Path) {
            var request= $http({
                method  :   'get',
                url     :   baseUrl + '/api/op',
                params  :   {
                    module :   apiModule,
                    function : 'delete_file',
                    args : Path
                }
            })
            return request;
        };

        factory.loadFile = function(Path) {
            var request= $http({
                method  :   'get',
                url     :   baseUrl + '/api/op',
                params  :   {
                    module :   apiModule,
                    function : 'load_file',
                    args : Path
                }
            })
            return request;
        };

        factory.updateState = function() {
            updateState();
        }

        //factory.updateRunState = function() {
        //    updateRunState();
        //}

        factory.tm_start = function() {
            startTimer();
        };

        factory.tm_stop = function() {
            stopTimer();
        };

        factory.getState = function() {
            updateState();
        }

        factory.state = function() {
            return $rootScope.currentState;
        };

        factory.getRunState = function() {
            return doApi('get_runState');
        };

        factory.getMenuState = function() {
            return doApi('get_state');
        };

        factory.getAnalysisOptions = function () {
            return doApi('get_analysisOptions');
        };

        factory.getFilterOptions = function () {
            return doApi('get_filterOptions');
        };

        factory.getAgentOptions = function () {
            return doApi('get_agentConfig');
        };

        factory.getSerializerOptions = function () {
            return doApi('get_serializerOptions');
        };

        factory.getConfig = function () {
            return doApi('get_config');
        };

        factory.clearFilter = function () {
            return postApi('clearFilter',{});
        }

        factory.getStats = function () {
            return doApi('get_stats');
        };

        factory.getMenuOptions = function () {
            return doApi('get_menuOptions');
        };

        factory.setNumAgents = function (NumAgents) {
            return postApi('agents',{agents : NumAgents});
        };

        factory.setJobDescription = function (JobDescription) {
            return postApi('jobdescription',{jobDescription : JobDescription});
        };

        factory.getJobDescription = function() {
            return doApi('get_jobDescription');
        }

        factory.invoke = function(Path,Verb,Params,Data) {
            var deferred = $q.defer();
            $http({
                method  :   Verb,
                url     :   baseUrl + Path,
                params  :   Params,
                data    :   Data
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function() {
                deferred.reject('Error')
            })
            return deferred.promise;
        };
        return factory;
    };

    apiFactory.$inject = ['$http','$q', '$log', '$rootScope', '$interval', 'appSettings'];

    angular.module('harvesterApp').factory('apiFactory',apiFactory);

}());