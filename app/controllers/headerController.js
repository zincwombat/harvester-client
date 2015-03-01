/**
 * Created by tonyhobbins on 27/02/15.
 */
function headerController($scope, $location)
{
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}