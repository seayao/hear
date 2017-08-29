/**
 * Created by lx on 2016/11/8.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;

var queryData = require('../data/queryData');

router.post('/resetPwdApi', function (req, response) {
    console.log('重置密码');
    queryData('mycollection', {_id: ObjectId(req.body.userId)}, function (userInfo) {
        userInfo[0].userPwd = "abc123";
        var mongodb = require('mongodb');
        var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
        var db = new mongodb.Db('heardatabase', server, {safe: true});
        db.open(function (err, db) {
            if (!err) {
                console.log('打开数据库成功！');
                db.collection('mycollection', function (err, collection) {
                    if (err) {
                        throw err;
                        console.log("连接数据集合出错");
                    } else {
                        console.log("成功连接数据集合");
                        //更新
                        //{$set:upDataAfter}
                        collection.update({_id: ObjectId(req.body.userId)}, {$set: userInfo[0]}, function (err, res) {
                            if (err) {
                                throw err;
                            } else {
                                console.log("成功更新" + JSON.parse(res).n + "条数据");
                                collection.find({}).toArray(function (err, docs) {
                                    if (err)
                                        throw err;
                                    else
                                    response.send({
                                        state: 200
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