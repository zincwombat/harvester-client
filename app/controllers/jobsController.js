(function() {

    var jobsController = function ($scope, $log, jobFactory, appSettings, ngDialog) {
        $scope.sortBy = 'name';
        $scope.reverse = false;
        $scope.jobs = [];
        $scope.appSettings = appSettings;
        $scope.serializers = [];
        $scope.thisSerializer = {
            uuid : '',
            key : 'null',
            filename : ''
        };
        $scope.thisJob = [];
        $scope.filename = [];
        // customise the following re
        $scope.filename_re=/^\w+$/;

        function init() {
            jobFactory.getJobs()
                .success(function (Data) {
                    $scope.jobs = Data;
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

        $scope.checkFileName = function(data) {
            var re=/^[a-zA-Z0-9_-]{5,14}$/;
            if (!re.test(data)) {
                return "invalid filename. regexp: ^[a-zA-Z0-9_-]{5,14}!";
            }
        };

        $scope.deleteJob = function(uuid) {
            jobFactory.deleteJob(uuid)
                .success(function (Data) {
                    init();
                })
                .error(function (data,status,headers,config) {
                    alert('error: ' + status);
                    $log.log(data.error + ' ' + status);
                });

        };

        $scope.openDialog = function(uuid) {
            $scope.thisJob=uuid;
            $scope.thisSerializer.uuid=uuid;
            jobFactory.getSerializersByJob(uuid)
                .success(function (Data) {
                    $scope.serializers = Data;
                    ngDialog.open({
                        template: 'app/views/dumpJob.html',
                        className: 'ngdialog-theme-default',
                        scope : $scope});
                })
                .error(function (data,status,headers,config) {
                    alert('error: ' + status);
                    $log.log(data.error + ' ' + status);
                });
        };

        $scope.dumpJob = function(Data) {
            jobFactory.dumpJob(Data);
            return true;
        };

        init();
    };

    jobsController.$inject = ['$scope','$log', 'jobFactory', 'appSettings', 'ngDialog'];

    angular.module('harvesterApp')
        .controller('jobsController', jobsController);
}());