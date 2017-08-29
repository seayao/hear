/**
 * Created by lx on 2016/11/10.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var queryData = require('../data/queryData');

router.post('/onlyQuery', function(req, res) {
    console.log("用户主页");
    queryData('mycollection', {_id:ObjectId(req.body.userId)},function(callback){
        //console.log(callback);
        if(callback.length == 1){
            res.send({
                state:200,
                data:callback
            });
        }else {
            res.send({
                state:0
            })
        }
    });
});


module.exports = router;