/**
 * Created by lx on 2016/11/10.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var queryData = require('../data/queryData');

router.post('/getUserByIdApi', function(req, res) {
    console.log('开始查询');
    queryData('mycollection', {_id:ObjectId(req.body._id)},function(callback){
        if(callback.length > 0){
            res.send({
                state:200,
                data:callback
            });
        }
    });
});

module.exports = router;