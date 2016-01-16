angular.module('boorishpenguin', [

      'boorish.services',
      'boorish.session',
      'boorish.detail',
      'boorish.users',
      'boorish.ask',
      'boorish.questions',
      'boorish.answers',
      'boorish.auth',
      'boorish.livestream',
      'boorish.trending',
      'ngRoute'
    ])

    .config(function ($routeProvider, $sceProvider) {
      $routeProvider
          .when('/', {
            templateUrl: 'app/questions/questions.html',
            controller: 'questionsController'
          })
          .when('/ask', {
            templateUrl: 'app/ask/ask.html',
            controller: 'askController'
          })
          .when('/questions', {
            templateUrl: 'app/questions/questions.html',
            controller: 'questionsController'
          })
          .when('/questions/:id', {
            templateUrl: 'app/answers/answers.html',
            controller: 'answersController'
          })
          .when('/users', {
            templateUrl: 'app/users/users.html',
            controller: 'UsersController'
          })
          .when('/session',{
            templateUrl: 'app/session/session.html',
            controller: 'SessionController'
          })
          .when('/sessions/:id', {
            controller: 'DetailsController',
            templateUrl: 'app/detail/detail.html'
          })
          .when('/signin', {
            templateUrl: 'app/auth/signin.html',
            controller: 'AuthController'
          })
          .when('/livestream/:eventId', {
            templateUrl: 'app/livestream/livestream.html',
            controller: 'livestreamController'
          })
          .when('/trending', {
              templateUrl: 'app/trending/trending.html',
              controller: 'TrendController'
          })
          .otherwise({
            routeTo: '/signin'
          });

      $sceProvider.enabled(false);
    });