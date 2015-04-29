(function() {

    var statsController = function ($scope, $rootScope, $log, common, appSettings) {

        $scope.sortBy = 'name';
        $scope.reverse = false;
        $scope.appSettings = appSettings;

        $scope.doSort = function(propName) {
            $scope.sortBy = propName;
            $scope.reverse = !$scope.reverse;
        };

        common.updateStats();

    };

    statsController.$inject = ['$scope','$rootScope', '$log', 'common', 'appSettings'];

    angular.module('harvesterApp')
        .controller('statsController', statsController);

}());