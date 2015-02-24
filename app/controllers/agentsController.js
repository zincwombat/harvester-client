(function () {

    var agentsController = function ($scope, ngDialog, apiFactory,  appSettings) {

        $scope.appSettings = appSettings;
        $scope.agents_options_array=[];
        $scope.agentOptions={};

        var promise = apiFactory.getAgentOptions();
        promise.then(
            function(Data) {
                $scope.agentOptions=Data;
                maxAgents=Data.maxAgents;
                defaultAgents=Data.defaultAgents;
                $scope.value=defaultAgents;
                $scope.options = {
                    from: 1,
                    to: 250,
                    step: 2,
                    scale: [1,'|', 50, '|', 100, '|', 150, '|', 200, '|', 250],
                    dimension: ""
                };
                angular.forEach(Data, function (value,key) {
                    $scope.agents_options_array.push({key:key,value:value});
                }, Data);
        });


        $scope.submitData = function(Data) {
            // Data contains the selected number of agents
            var promise=apiFactory.setNumAgents(Data);
            promise.then(
                $scope.agentOptions.defaultAgents=Data
            )
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