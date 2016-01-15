var livestream = angular.module('boorish.livestream', ['firebase']);

livestream.controller('livestreamController', function($scope, $location,$routeParams, Questions) {
    $scope.youtubeUrl = 'https://www.youtube.com/v/XGorYyIA8rw?autoplay=1'; //add the youtube url here
    $scope.questions = [];
    Questions.getSession('/sessions/' + $routeParams.eventId, function (res) {
      //ask hridya what is this field, title? subject?
      $scope.title = res.data.results[0].course;
      $scope.eventDate = res.data.results[0].time;
      $scope.author = res.data.results[0].user;
      console.log($scope.user)
    });
  });
