/**
 * Created by hridhya on 1/12/16.
 */
var db = require('../db/index.js');
var UCtrl = require('./userControllers.js');

var date = new Date();

module.exports = {
    newSession: function(req, res){

        var coursename = req.body.course;
        console.log(coursename);
        var time = req.body.time;
        var uid = req.body.id_user;

        db.User.findById(uid)
            .then(function(user) {
                console.log(user.email);
                user.update({
                        points: user.points + 1
                    })
                    .then(function() {
                        db.Session.create({
                            UserId: user.id,
                            Course: coursename,
                            Time: time
                        })
                            .then(function(question) {
                                res.status(201).json(question);
                            });
                    });
            });
    },

    allSessions: function(req, res){
        db.Session.findAll({
            where: {
                Time:{
                    gt: date
                }
            },
            include: [db.User]
        }).then(function(sessions){
            var formattedSs = sessions.map(function(session) {
                return {
                    id: session.id,
                    course: session.Course,
                    user: session.User.name,
                    time: session.Time
                }
            });

            sessions = {};
            sessions.results = formattedSs;
            res.json(sessions);

        })

    },

    readSession: function(req, res){
        var qid = req.params.id;
        db.Session.findById(qid, {
            include: [db.User]
        }).then(function(session){
            var formattedS = [{id: session.id, user: session.User.name, course: session.Course, time: session.Time}];
            session = {};
            session.results = formattedS;
            res.json(session);
        })
    }
};



