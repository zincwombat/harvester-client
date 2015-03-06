
(function () {

    var wsController = function (wsFactory) {

        $scope.appSettings = appSettings;
        $scope.wsFactory = wsFactory;

    };

    wsController.$inject = ['wsFactory'];

    angular.module('harvesterApp')
        .controller('wsController', wsController);
})();