/**
 * Created by hridhya on 1/13/16.
 */
angular.module('boorish.detail', [])

.controller('DetailsController', function($scope, $location, Sessions, Questions, Auth){


    $scope.data = {};

    $scope.getSession = function(){
        var path = $location.path();
        Questions.getSession(path)
            .then(function(res){
                console.log(res);
                $scope.data.question = res.data.results[0];
            })
    }

    if (!Auth.isAuth()) {
        $location.path('/signin');
    } else {
        $scope.getSession();
    }

});