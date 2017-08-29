/**
 * Created by Administrator on 2017/4/26.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var queryData = require('../data/queryData');


router.post('/getTopListByTypeApi', function(req, res) {
    console.log('排行榜查询');
    queryData('allSongs', {toplistType:req.body.toplistType},function(toplist){
        if(toplist.length > 0){
            res.send({
                state:200,
                data:toplist
            });
        }else {
            res.send({
                state:0
            });
        }
    });
});

module.exports = router;