(function () {

    var wsController = function ($scope, $rootScope, ngWebsocket, apiFactory,  appSettings) {

        $scope.appSettings = appSettings;

    };

    wsController.$inject = ['$scope', '$rootScope', 'ngWebsocket',  'apiFactory', 'appSettings'];

    angular.module('harvesterApp')
        .controller('wsController', wsController);
})();