angular.module("boorish.trending", [])
    .controller('TrendController', function($scope, $location, Auth, Questions){

        $scope.myDataSource = {
            chart: {
                caption: "Harry's SuperMart",
                subCaption: "Top 5 stores in last month by revenue",
            },
            data:[{
                label: "Bakersfield Central",
                value: "880000"
            },
                {
                    label: "Garden Groove harbour",
                    value: "730000"
                },
                {
                    label: "Los Angeles Topanga",
                    value: "590000"
                },
                {
                    label: "Compton-Rancho Dom",
                    value: "520000"
                },
                {
                    label: "Daly City Serramonte",
                    value: "330000"
                }]
        };

        $scope.questions = [];
        $scope.data = {};


        $scope.getInfo = function(){
            Questions.getAllQuestions().then(function(data) {
                $scope.questions = data.results;
                console.log($scope.questions);
                //for(var i = 0; i < questions.length; i++){
                //        var path = $location.path(); // e.g., '/questions/19'
                //        Questions.getQuestion('/questions/i').then(function(res) {
                //            console.log('Here');
                //            $scope.data[i].question = res.data.results[0];
                //            $scope.data[i].answers = res.data.results.slice(1);
                //        });
                //}
                //console.log($scope.data);

            })


        };

        if (!Auth.isAuth()) {
            $location.path('/signin');
        } else {
            $scope.getInfo();
        }

    });

