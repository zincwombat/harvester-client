(function() {
    var jobFactory = function ($http, appSettings) {

        var factory = {};
        var baseUrl = appSettings.urlbase;
        var apiModule = appSettings.apiModule;

        factory.getJobs = function() {
            var request= $http({
                method  :   'get',
                url     :   baseUrl + '/api/op',
                params  :   {
                                module :   apiModule,
                                function : 'get_jobs'
                }
            })
            return request;
        };

        factory.deleteJob = function(uuid) {
            var request= $http({
                method  :   'get',
                url     :   baseUrl + '/api/op',
                params  :   {
                    module :   apiModule,
                    function : 'delete_job',
                    args : uuid
                }
            })
            return request;
        };

        factory.getSerializersByJob = function(uuid) {
            var request= $http({
                method  :   'get',
                url     :   baseUrl + '/api/op',
                params  :   {
                    module :   apiModule,
                    function : 'get_serializersByJob',
                    args : uuid
                }
            })
            return request;
        };

        factory.dumpJob = function(Data) {
            var request= $http({
                method  :   'post',
                url     :   baseUrl + '/api/op/dump',
                data    :   Data
            })
            return request;
        };

        return factory;
    };

    jobFactory.$inject = ['$http','appSettings'];
    angular.module('harvesterApp').factory('jobFactory',jobFactory);
}());