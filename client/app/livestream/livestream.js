angular.module('boorish.livestream', [ "myChat" ])

  .controller('livestreamController', function($scope, $location,$routeParams) {
    $scope.youtubeUrl = ''; //add the youtube url here
    $scope.questions = [];
    $routeParams.eventId
  });
