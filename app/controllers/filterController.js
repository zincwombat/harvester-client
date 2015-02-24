(function () {

    // this should really be a service
    var filterController = function ($scope, apiFactory,  appSettings) {
        $scope.appSettings = appSettings;
        $scope.filter_options_array=[];

        $scope.submitData = function(Data) {
            $scope.$emit('filterData', Data);
            return true;
        };

        var promise = apiFactory.getFilterOptions();

        promise.then(
            function(Data) {
                $scope.filter_options_array=Data;
        })
    };

    filterController.$inject = ['$scope', 'apiFactory', 'appSettings'];

    angular.module('harvesterApp')
        .controller('filterController', filterController);
})();