angular.module('boorish.services', [])

// Questions factory handles all requests to add, retrieve, or modify questions in the database

    .factory('Sessions', function($http, $location) {
      return {
        addSession: function (session) {
          console.log(session);
          return $http({
            method: 'POST',
            url: '/townhall/sessions',
            data: JSON.stringify({
              id_user: session.userId,
              url: session.url,
              course: session.course,
              time: session.time
            })
          })
        },

        selectedQuestion: function(res, id) {
          console.log(res);
          return $http({
            method: 'POST',
            url: 'townhall/queuedQ',
            data: JSON.stringify({
              question: res,
              sessionID: id
            })
          })
        },

        postSessionQ : function(sessionQuestion, sessionID){
          return $http({
            method: 'POST',
            url: '/townhall/sessionQ',
            data: JSON.stringify({
              sessionQ: sessionQuestion.sessionQ,
              id_session: sessionID,
              id_user: sessionQuestion.user
            })
          })

        }
      }
    })

.factory('Questions', function($http, $location) {
  return {
    // add a question from /ask
    addQuestion: function(question) {
      return $http({
        method: 'POST',
        url: '/townhall/questions',
        data: JSON.stringify({
          text: question.text,
          id_user: question.userId,
          course: question.course,  // these are not setup yet
          tag: question.tag,  // these are not setup yet
          title: question.title
        })
      })
    },

    getAllQuestions: function() {
      return $http({
        method: 'GET',
        url: '/townhall/questions/'
      })
      .then(function(res) {
        return res.data; // returns all questions
      })
    },

    getQuestion: function(path) {
      console.log('Services');
      return $http({
        method: 'GET',
        url: '/townhall' + path
      })
      .then(function(res) {
        console.log(res);
        return res; // returns question and related answers
      })
    },


    getAllSessions: function(){
      return $http({
        method: 'GET',
        url: '/townhall/sessions'
      })
          .then(function(res){
            return res;
          })

    },

    getSession: function(path){
      return $http({
        method: 'GET',
        url: '/townhall' + path
      })
          .then(function(res){
            return res;
          })

    },

    // updates a question. takes in the id of the question and the required modification
    updateQuestion: function(id, mod) {
      return $http({
        method: 'POST',
        url: 'townhall/questions/' + id,
        data: { mod: mod } // possible mods = 'like' to increase like points, 'good' to mark as good (by teacher), 'answered', 'closed'
      })
    },

    // removes a question. Only available to the user who posted it or a Teacher (isAdmin = true)
    removeQuestion: function(questionID) {
      return $http({
        method: 'DELETE',
        url: 'townhall/questions/' + questionID
      })
    }
  }
})

// Answers factory handles all requests to add, retrieve, or modify answers in the database

.factory('Answers', function($http) {

  return {
    // get all answers
    getAnswers: function() {
      return $http({
        method: 'GET',
        url: 'townhall/answers',
      })
      .then(function(res) {
        return res.data;
      })
    },

    // adds an answer to a question. requires the answer object and question ID
    addAnswer: function(answer, questionID) {

      return $http({
        method: 'POST',
        url: 'townhall/answers',
        data: JSON.stringify({
          text: answer.text,
          id_question: questionID,
          id_user: answer.user
        })
      })
    },

    // updates an answer. requires the answerID and requested modification (mod). mod is a string.
    updateAnswer: function(answerID, mod) {
      return $http({
        method: 'POST',
        url: 'townhall/answers/' + answerID,
        data: JSON.stringify({
          id_answer: answerID,
          mod: mod // possible mods: 'like' to increase the number of points on a question, 'good' to mark as good
        })
      })
    },

    // removes an answer. requires the id of the answer
    removeAnswer: function(answerID) {
      return $http({
        method: 'DELETE',
        url: 'townhall/answers/' + answerID
      })
    }

  }
})

// Users factory handles all requests to add and retrieve users in the database

.factory('Users', function($http, $window){

  return {

    allUsers: function(){
      return $http({
        method: 'GET',
        url: '/townhall/users'
      })
      .then(function(res){
        return res.data;
      });
    },

    // users the userID that is stored in localStorage to obtain the user from the database
    getUserWithId: function() {
      var userID = $window.localStorage.getItem('com.boorish');
      return $http({
        method: 'GET',
        url: '/townhall/users/' + userID
      }).then(function(res) {
        return res.data.results.id;
      })
    },

    addUser: function(user) {
      return $http({
        method: 'POST',
        url: '/townhall/users',
        data: JSON.stringify({
          username: user.username,
          password: user.password,
          name: user.name,
          isTeacher: user.isTeacher,
          points: 0,
          email: user.email,
          picture: user.picture
        })
      })
    }

  };
})

    .factory('API', function ($http) {
      return {
        uploadLogo: function(logo) {
          var formData = new FormData();
          formData.append("file", logo);
          return $http.post('/townhall/uploads', formData, {
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
          });
        }
      };
    })


// Tags and Course factories just pull Tags and Courses from the database

.factory('Tags', function($http) {
  
  return {

    getTags: function() {
      return $http({
        method: 'GET',
        url: '/townhall/tags'
      })
      .then(function(res) {
        console.log(res);
        return res.data;
      });
    }

  };
})

.factory('Courses', function($http) {
  
  return {

    getCourses: function() {
      return $http({
        method: 'GET',
        url: '/townhall/courses'

      })
      .then(function(res) {
        return res.data;
      });
    }

  };
})

.factory('Auth', function ($http, $location, $window) {
  var user = {};

  return {
    
    setUser: function () {
      return $http({
        method: 'GET',
        url: '/user'
      })
      .then(function (res) {
        user.google = res.data.email || res.data.profile.emails[0].value;

        return $http({
          method: 'GET',
          url: '/townhall/users'
        })
        .then(function(res) {
          var users = res.data.results;
          var isUser = false;
          for (var i = 0; i < users.length; i++) {
            if (users[i].email === user.google) {
              isUser = true;
              user.id = users[i].id;
            }
          }
          if (isUser) {
            $window.localStorage.setItem('com.boorish', user.id);
          } else {
            $location.path('/signin');
          }
        })
      });
  },

  isAuth: function () {
    return !!$window.localStorage.getItem('com.boorish');
  },

  signout: function () {
    $window.localStorage.removeItem('com.boorish');
    $location.path('/signin');
  }
}

});
