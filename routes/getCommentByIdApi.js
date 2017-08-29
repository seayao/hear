/**
 * Created by Administrator on 2017/4/26.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var queryData = require('../data/queryData');

router.post('/getCommentByIdApi', function(req, res) {
    console.log('评论详情');
    queryData('comment', {_id:ObjectId(req.body.commentId)},function(commentInfo){
        if(commentInfo.length == 1){
            res.send({
                state:200,
                data:commentInfo
            });
        }else {
            res.send({
                state:0
            });
        }
    });
});

module.exports = router;