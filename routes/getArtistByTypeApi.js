/**
 * Created by lx on 2016/11/10.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var queryData = require('../data/queryData');

router.post('/getArtistByTypeApi', function(req, res) {
    console.log('开始查询');
    console.log(req.body);
    queryData('allArtists', {bigType:req.body.bigType,smallType:req.body.smallType},function(callback){
        res.send({
            state:200,
            data:callback
        });
    });
});

module.exports = router;