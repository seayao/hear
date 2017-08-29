/**
 * Created by lx on 2016/11/8.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;

var insertData = require('../data/insertData');

router.post('/uploadSongs', function (req, res) {
    console.log("上传歌曲");
    var file = req.files;
    //上传歌曲图片，MP3，歌词
    if(file.songImg){
        fs.renameSync(file.songImg.path, __dirname + "/../allLoadFile/" + file.songImg.name);
        req.body.imgName = file.songImg.name;
    }
    if(file.mp3File){
        fs.renameSync(file.mp3File.path, __dirname + "/../allLoadFile/" + file.mp3File.name);
        req.body.mp3File = file.mp3File.name;
    }
    if(file.lrcFile){
        fs.renameSync(file.lrcFile.path, __dirname + "/../allLoadFile/" + file.lrcFile.name);
        req.body.lrcFile = file.lrcFile.name;
    }
    //获取年月日
    var date = new Date();
    this.timeStamp = date.getTime();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.day = date.getDate();
    req.body.uploadTime = this.year+"-"+this.month+"-"+this.day;
    req.body.timeStamp = this.timeStamp;
    req.body.toplistType = "音乐新歌榜";
    req.body.listener = 0;
    req.body.collectNum = 0;
    req.body.whoCollect = [];
    req.body.shareNum = 0;
    req.body.commentNum = 0;
    req.body.beizhu = "";
    insertData('allSongs', req.body ,function(callback){
        if(callback.result.ok == 1){
            res.send({
                state:200
            });
        }
    });
});

module.exports = router;
