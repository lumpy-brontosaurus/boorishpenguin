angular.module('boorish.answers', ["firebase"])

.controller('answersController', function($scope, $location, $window, Answers, Questions, Users, Auth, $firebaseObject) {
  $scope.data = {};
  $scope.newAnswer = {};

  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///// Answers Controller:
  ///// This controller enables functionality to get and display individual questions and the answers that are related to that question
  ///// Methods:
  /////   getQuestion. Retrieves the Post data from the database using the getQuestion method. This returns an array of Posts.
  /////   IMPORTANT: The question will always be the first item in the results array.
  /////
  /////   addAnswer. Pulls the id of the current user with the getUserWithID factory method and add answer with the addAnswer factory methdod
  /////   
  /////   updateAnswer. There are two modifications that a user can make on an answer. 
  /////       1. 'like': Any user can like an answer.
  /////       2. 'good': Only a teacher can mark a question as 'good'.
  /////   
  /////   updateQuestion. There are four modifications that a user can make on a question:
  /////       1. 'like': Any user can like a question.
  /////       2. 'good': Only a teacher can mark a question as 'good'.
  /////       3. 'answered': Only a teacher and the user who asked the question can mark it as answered.
  /////       4. 'closed': Only a teacher can mark an answer as 'closed,' which prevents other answers to the question.
  /////   
  /////   removeQuestion. A question can only be deleted by a teacher or the user who asked the question. This removes the question and all answers.
  /////   
  /////   removeAnswer. An answer can only be deleted by a teacher or the user who posted the answer. This removes the answer.
  ///////////////////////////////////////////////////////////////////////////////////////////////

  $scope.getQuestion = function() {
    var path = $location.path(); // e.g., '/questions/19'
      Questions.getQuestion(path).then(function(res) {
      $scope.data.question = res.data.results[0];
      $scope.data.answers = res.data.results.slice(1);
    });
  };

  $scope.upload = function(){
    Users.getUserWithId().then(function(userID) {

      var refImg = new Firebase("https://joksina.firebaseio.com/images/" + userID);
      var ImgObj = $firebaseObject(refImg);
      
      //function saveimage(e1) {
      //  var filename = e1.target.files[0];
      //  var fr = new FileReader();
      //  fr.onload = function (res) {
      //    $scope.image = res.target.result;
      //    ImgObj.image = res.target.result;
      //    ImgObj.$save().then(function (val) {
      //    }, function (error) {
      //      console.log("ERROR", error);
      //    })
      //  };
      //  fr.readAsDataURL(filename);
      //}
      //
      //document.getElementById("file-upload").addEventListener('change', saveimage, false);
      //
      //this.loadimage = function () {
      //  ImgObj.$loaded().then(function (obj) {
      //    console.log(obj.image);
      //    $scope.profileImage = obj.image;
      //    console.log("loaded", $scope.profileImage);
      //    document.getElementById("profileImage").src = obj.image;
      //  }, function (error) {
      //    console.log("ERROR", error);
      //  });
      //};
      //this.loadimage();
    })

  };

  $scope.addAnswer = function() {
    var id_question = $scope.data.question.id;

    Users.getUserWithId().then(function(userID) { // grabs the userID
      $scope.newAnswer.user = userID; // adds the userID to the answer
      Answers.addAnswer($scope.newAnswer, id_question).then(function() { // adds answer
        console.log($scope.newAnswer);
        $scope.newAnswer.text = '';
        $scope.getQuestion(); // refreshes the view
      });
    });
  };

  $scope.updateAnswer = function(index, mod) {
    var answerID = $scope.data.answers[index].id; // pulls the id of the selected answer
    Answers.updateAnswer(answerID, mod).then(function() { // passes answerID and modification ('like', 'closed', 'good', or 'answered')
      $scope.getQuestion(); // refreshes the view
    })
  };

  $scope.updateQuestion = function(mod) {
    var questionID = $scope.data.question.id; // pulls the id of the question
    Questions.updateQuestion(questionID, mod).then(function() {
      $scope.getQuestion();
    });
  };

  $scope.removeQuestion = function() {
    var id_question = $scope.data.question.id;  // pulls the id of the question
    Questions.removeQuestion(id_question).then(function() {
      $location.path('/questions'); // redirects to all questions after a question is removed
    })
  };

  $scope.removeAnswer = function(index) {
    var answerID = $scope.data.answers[index].id; // pulls the answer id of the selected answer
    Answers.removeAnswer(answerID).then(function() {
      $scope.getQuestion();
    }); // removes answer
  };

  $scope.QuestionisPostedByLoggedInUser = function() {
    var userID = $window.localStorage.getItem('com.boorish');
    Users.getUserWithId(userID).then(function(user) {
      return user.id === $scope.data.question.userid;
    });
  };

  $scope.AnswerisPostedByLoggedInUser = function(index) {
    var userID = $window.localStorage.getItem('com.boorish');
    Users.getUserWithId(userID).then(function(user) {
      console.log(user.id === $scope.data.answers[index].userid);
    });
  };

  if (!Auth.isAuth()) {
    $location.path('/signin');
  } else {
    $scope.getQuestion();
  }
})
