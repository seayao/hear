/**
 * Created by Administrator on 2017/4/25.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var queryData = require('../data/queryData');

router.post('/getSongByIdApi', function(req, res) {
    console.log('歌曲详情');
    queryData('allSongs', {_id:ObjectId(req.body.songId)},function(songInfo){
        if(songInfo.length > 0){
            res.send({
                state:200,
                data:songInfo
            });
        }else {
            res.send({
                state:0
            });
        }
    });
});

module.exports = router;