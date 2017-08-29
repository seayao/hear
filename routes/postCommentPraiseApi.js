/**
 * Created by lx on 2016/11/10.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var queryData = require('../data/queryData');
//删除数组中指定元素
function removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}

router.post('/postCommentPraiseApi', function(req, response) {
    console.log("评论点赞");
    var commentId = req.body.commentId;
    var userId = req.body.userId;
    var commentInfo;
    queryData('comment', {_id:ObjectId(commentId)},function(docsComment){
        commentInfo = docsComment[0];
        if(commentInfo.whoPraise.length == 0){
            commentInfo.whoPraise.push(userId);
            commentInfo.praiseNum = parseInt(commentInfo.praiseNum) + 1;
        }else if(commentInfo.whoPraise.indexOf(userId) > -1){
            commentInfo.whoPraise = removeByValue(commentInfo.whoPraise,userId);
            console.log(commentInfo.whoPraise)
            commentInfo.praiseNum = parseInt(commentInfo.praiseNum) - 1;
        }else if(commentInfo.whoPraise.indexOf(userId) <= -1){
            commentInfo.whoPraise.push(userId);
            commentInfo.praiseNum = parseInt(commentInfo.praiseNum) + 1;
        }
        //更新赞
        var mongodb = require('mongodb');
        var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
        var db = new mongodb.Db('heardatabase', server, {safe: true});
        db.open(function (err, db) {
            if (!err) {
                console.log('打开数据库成功！');
                db.collection('comment', function (err, collection) {
                    if (err) {
                        throw err;
                        console.log("连接数据集合出错");
                    } else {
                        console.log("成功连接数据集合");
                        //更新
                        //{$set:upDataAfter}
                        collection.update({_id: ObjectId(commentId)}, {$set: commentInfo}, function (err, res) {
                            if (err) {
                                throw err;
                            } else {
                                console.log("成功更新" + JSON.parse(res).n + "条数据");
                                collection.find({}).toArray(function (err, docs) {
                                    if (err)
                                        throw err;
                                    else
                                    response.send({
                                        state: 200,
                                        data: docs
                                    });
                                    db.close();
                                });
                            }
                        });
                    }
                });
            }
            else {
                console.log('打开数据库失败！');
                console.log(err);
            }
        });
    });
});


module.exports = router;