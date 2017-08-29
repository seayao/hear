/**
 * Created by Administrator on 2017/4/26.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var queryData = require('../data/queryData');


router.get('/getTopListSoarApi', function(req, res) {
    console.log('飙升榜查询');
    queryData('allSongs', {toplistType:"音乐飙升榜"},function(toplistSoar){
        if(toplistSoar.length > 0){
            res.send({
                state:200,
                data:toplistSoar
            });
        }else {
            res.send({
                state:0
            });
        }
    });
});

module.exports = router;