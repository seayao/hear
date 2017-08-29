/**
 * Created by Administrator on 2017/4/26.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var queryData = require('../data/queryData');


router.get('/getTopListOriginalApi', function(req, res) {
    console.log('原创榜查询');
    queryData('allSongs', {toplistType:"原创音乐榜"},function(toplistOriginal){
        if(toplistOriginal.length > 0){
            res.send({
                state:200,
                data:toplistOriginal
            });
        }else {
            res.send({
                state:0
            });
        }
    });
});

module.exports = router;