/**
 * Created by Administrator on 2017/4/26.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var queryData = require('../data/queryData');


router.get('/getTopListNewApi', function(req, res) {
    console.log('新歌榜查询');
    queryData('allSongs', {toplistType:"音乐新歌榜"},function(toplistNew){
        if(toplistNew.length > 0){
            res.send({
                state:200,
                data:toplistNew
            });
        }else {
            res.send({
                state:0
            });
        }
    });
});

module.exports = router;