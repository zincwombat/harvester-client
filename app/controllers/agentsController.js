(function () {

    var agentsController = function ($scope, ngDialog, apiFactory,  appSettings) {

        $scope.appSettings = appSettings;
        $scope.agents_options_array=[];
        $scope.agentOptions={};

        var promise = apiFactory.getAgentOptions();
        promise.then(
            function(Data) {
                $scope.agentOptions=Data;
                var maxAgents=Data.maxAgents;
                var defaultAgents=Data.defaultAgents;
                $scope.value=defaultAgents;
                $scope.options = {
                    from: 1,
                    to: maxAgents,
                    step: 1,
                    dimension: ""
                };
        });


        $scope.submitData = function(Data) {
            // Data contains the selected number of agents
            var promise=apiFactory.setNumAgents(Data);
            promise.then(
                $scope.agentOptions.defaultAgents=Data
            );
            return true;
        };

        $scope.openDialog = function(Data) {
            ngDialog.open({
                template: 'app/views/setAgents.html',
                className: 'ngdialog-theme-default',
                scope : $scope});
        };
    };

    agentsController.$inject = ['$scope', 'ngDialog', 'apiFactory', 'appSettings'];

    angular.module('harvesterApp')
        .controller('agentsController', agentsController);
})();