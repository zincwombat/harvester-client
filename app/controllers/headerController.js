(function () {
    var headerController=function($scope,$location) {
        $scope.isActive= function (viewLocation) {
            return viewLocation===$location.path();
        }
    };

    headerController.$inject = ['$scope','$location'];

    angular.module('harvesterApp')
        .controller('headerController', headerController);
})();