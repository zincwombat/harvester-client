(function () {

    var analysisController = function ($scope, apiFactory,  appSettings) {
        $scope.appSettings = appSettings;
        $scope.analysis_options_array=[];

        $scope.submitData = function(Data) {
            $scope.$emit('analysisData', Data);
            return true;
        };

        var promise = apiFactory.getAnalysisOptions();

        promise.then(
            function(Data) {
                $scope.analysis_options_array=Data;
        })
    };

    analysisController.$inject = ['$scope', 'apiFactory', 'appSettings'];

    angular.module('harvesterApp')
        .controller('analysisController', analysisController);
})();