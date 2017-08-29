/**
 * Created by lx on 2016/11/8.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;
var upDate = require('../data/upDate');

router.post('/updateArtistInfoApi', function (req, response) {
    console.log(req.body);
    var file = req.files;
    if (file.artistImg) {
        //如果上传内容包含图片
        fs.renameSync(file.artistImg.path, __dirname + "/../allLoadFile/" + file.artistImg.name);
        //把用户编辑的资料（包括图片）都更新到数据库
        req.body.artistImg = file.artistImg.name;
        upDate('allArtists', {_id: ObjectId(req.body.artistId)}, req.body, function (callback) {
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
        upDate('allArtists', {_id: ObjectId(req.body.artistId)}, req.body, function (callback) {
            if (callback) {
                response.send({
                    state: 200
                });
            }
        });
    }
});

module.exports = router;