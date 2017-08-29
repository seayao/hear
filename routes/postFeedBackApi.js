/**
 * Created by lx on 2016/11/8.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;

var insertData = require('../data/insertData');

router.post('/postFeedBackApi', function (req, res) {
    console.log("上传问题反馈");
    //获取年月日
    var date = new Date();
    this.timeStamp = date.getTime();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.day = date.getDate();
    req.body.uploadTime = this.year+"-"+this.month+"-"+this.day;
    req.body.timeStamp = this.timeStamp;
    req.body.praise = 0;
    req.body.whoPraise = [];
    req.body.beizhu = "";
    insertData('feedBack', req.body ,function(callback){
        console.log(callback);
        if(callback.result.ok == 1){
            res.send({
                state:200
            });
        }
    });
});

module.exports = router;
