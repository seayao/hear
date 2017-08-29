/**
 * Created by Administrator on 2017/4/29.
 */
var express = require('express');
var router = express.Router();
var url = require('url');

var queryData = require('../data/queryData');
var insertData = require('../data/insertData');

router.post('/postPlayListApi', function(req, response) {
    console.log('记录用户播放歌曲');
    var date = new Date();
    var playList = {
        userId:req.body.userId,
        songId:req.body.songId,
        songName:req.body.songName,
        artist:req.body.artist,
        songImg:req.body.songImg,
        mp3File:req.body.mp3File,
        createTime:req.body.createTime,
        timeStamp:date.getTime(),
        beizhu:""
    };
    //查询用户是否重复收听此首歌曲
    queryData('playList',
        {
            'userId':playList.userId,
            'songId':playList.songId
        },
        function (callback){
            if(callback.length >= 1){
                response.send({
                    state:1
                });
            }else {
                insertData('playList', playList ,function(playListInfo){
                    if(playListInfo.result.ok == 1){
                        response.send({
                            state:200,
                            data:playListInfo.ops[0]
                        });
                    }
                });
            }
        });
});

module.exports = router;