/**
 * Created by lx on 2016/11/8.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;

var insertData = require('../data/insertData');

router.post('/postCommentApi', function (req, res) {
    console.log("发表评论");
    var time = new Date().getTime();
    req.body.timeStamp = time;
    req.body.whoPraise = [];
    insertData('comment', req.body ,function(callback){
        console.log(callback);
        if(callback.result.ok == 1){
            res.send({
                state:200
            });
        }
    });
});

module.exports = router;
