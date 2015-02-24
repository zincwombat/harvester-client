(function () {

    // this should really be a service
    var serializerController = function ($scope, apiFactory,  appSettings) {
        $scope.appSettings = appSettings;
        $scope.serializer_options_array=[];

        $scope.submitData = function(Data) {
            $scope.$emit('serializerData', Data);
            return true;
        };

        var promise = apiFactory.getSerializerOptions();

        promise.then(
            function(Data) {
                $scope.serializer_options_array=Data;
        })
    };

    serializerController.$inject = ['$scope', 'apiFactory', 'appSettings'];

    angular.module('harvesterApp')
        .controller('serializerController', serializerController);
})();