/**
 * Created by tonyhobbins on 7/04/15.
 */


(function() {
    var common = function ($http, $rootScope, $q, $interval, $log, appSettings) {

        var TIMER_INTV = 5000;  // milliseconds
        var timerHandle;
        var baseUrl = appSettings.urlbase;
        var apiModule = appSettings.apiModule;
        var self = this;

        this.stats_object = {};
        this.updateRunState = function() {
            getRunstate();
        };

        this.updateStats = function () {
            getStats();
        }

        function getAPI(fn) {
            var deferred = $q.defer();
            $http({
                method  :   'get',
                url     :   baseUrl + '/api/op',
                params  :   {   module   : apiModule,
                                function : fn }
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject("API Call failed: " + status);
            })
            return deferred.promise;
        };

        function getRunstate() {
            getAPI('get_runState')
                .then(
                    function(data) {
                        this.runState=data.state;
                        $rootScope.currentState=data.state;
                        $rootScope.isComplete = (data.state === 'COMPLETED');
                    },
                    function(Message) {
                        $log.error(Message);
                    }
                )
        };

        function getStats() {
            getAPI('get_stats')
                .then(
                    function(data) {
                        this.stats_object=data;
                        $rootScope.stats_object=data;
                    },
                    function(Message) {
                        $log.error(Message);
                    }
            )
        };

        function startTimer() {
            if (angular.isDefined(timerHandle)) {
                $log.error("timer already running!");
            }
            else {
                $log.debug("starting timer");
                timerHandle = $interval(function () {
                    getRunstate();
                    getStats();
                }, TIMER_INTV, 0);
            }
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

        getRunstate();
        startTimer();

    };

    common.$inject = ['$http','$rootScope', '$q', '$interval','$log', 'appSettings'];
    angular.module('harvesterApp').service('common',common);
}());