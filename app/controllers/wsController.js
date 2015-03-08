
(function () {

    var wsController = function ($scope, wsFactory) {

        $scope.wsFactory = wsFactory;
    };

    wsController.$inject = ['$scope', 'wsFactory'];

    angular.module('harvesterApp')
        .controller('wsController', wsController);
})();