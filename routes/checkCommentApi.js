/**
 * Created by Administrator on 2017/4/25.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var queryData = require('../data/queryData');

//检测评论api
router.post('/checkCommentApi', function (req, res) {
    console.log('开始检测');
    if(req.body.comType == "歌曲"){
        queryData('allSongs', {_id:ObjectId(req.body.beComId)},function(songList){
            if(songList.length == 1){
                res.send({
                    state:200
                });
            }else {
                res.send({
                    state:-1
                });
            }
        });
    }else if(req.body.comType == "歌手"){
        queryData('allSongs', {_id:ObjectId(req.body.beComId)},function(artistList){
            if(artistList.length == 1){
                res.send({
                    state:200
                });
            }else {
                res.send({
                    state:-1
                });
            }
        });
    }
});

module.exports = router;