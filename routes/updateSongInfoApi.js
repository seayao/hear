/**
 * Created by lx on 2016/11/8.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;
var upDate = require('../data/upDate');

router.post('/updateSongInfoApi', function (req, response) {
    var file = req.files;
    if (file.imgName || file.mp3File || file.lrcFile) {
        //更新歌曲图片，MP3，歌词
        if(file.imgName){
            fs.renameSync(file.imgName.path, __dirname + "/../allLoadFile/" + file.imgName.name);
            req.body.imgName = file.imgName.name;
        }
        if(file.mp3File){
            fs.renameSync(file.mp3File.path, __dirname + "/../allLoadFile/" + file.mp3File.name);
            req.body.mp3File = file.mp3File.name;
        }
        if(file.lrcFile){
            fs.renameSync(file.lrcFile.path, __dirname + "/../allLoadFile/" + file.lrcFile.name);
            req.body.lrcFile = file.lrcFile.name;
        }
        upDate('allSongs', {_id: ObjectId(req.body.songId)}, req.body, function (callback) {
            if (callback) {
                response.send({
                    state: 200
                });
            }
        });
    } else {
        //上传内容仅仅是文字，不包括图片
        //把用户编辑的资料（仅仅是文本）都更新到数据库
        console.log('准备更新数据库（仅仅文本）');
        upDate('allSongs', {_id: ObjectId(req.body.songId)}, req.body, function (callback) {
            if (callback) {
                response.send({
                    state: 200
                });
            }
        });
    }
});

module.exports = router;