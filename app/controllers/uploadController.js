(function () {

    var uploadController = function ($scope, $upload, apiFactory,  appSettings) {
        var defaultLabel = "Import File";
        var defaultClass = "btn btn-primary btn-block";
        var loadingClass = "btn btn-secondary btn-block";
        $scope.appSettings = appSettings;
        $scope.progress = 0;
        $scope.formData = "";
        $scope.button_label = defaultLabel;
        $scope.button_class = defaultClass;
        $scope.onFileSelect = function ($files) {
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload(
                    {
                        url: appSettings.urlbase + '/api/op/upload',
                        file: file
                    }
                    ).progress(function (evt) {
                        var pct = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.progress = pct;
                        $scope.button_label = pct + "%";
                        $scope.button_class = loadingClass;
                        //console.log('percent: ' + pct);
                    })
                    .success(function (data, status, headers, config) {
                        $scope.button_label = defaultLabel;
                        $scope.button_class = defaultClass;
                        //console.log(data);
                        $scope.$emit('refresh', {message: "refresh"});
                    });
            }
        };

        $scope.submitData = function() {
            $scope.$emit('formData', {formData : $scope.formData});
            return true;
        };
    };

    uploadController.$inject = ['$scope', '$upload', 'apiFactory', 'appSettings'];

    angular.module('harvesterApp')
        .controller('uploadController', uploadController);
})();