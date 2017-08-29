/**
 * Created by lx on 2016/11/8.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;

var queryData = require('../data/queryData');
var upDate = require('../data/upDate');

router.post('/updateUser', function (req, response) {
    var file = req.files;
    //文件路径输出测试
    //console.log(__dirname+'/../allLoadFile/');
    //console.log('req.body：',req.body);
    //console.log('file：',file);
    //判断是一个数组（多张图片）还是一个对象（一张）
    //if(file.uploadImg.constructor==Array)
    if (file.uploadImg) {
        //如果上传内容包含图片的处理逻辑
        if (file.uploadImg instanceof Array) {
            file.uploadImg.forEach(function (v, i, a) {
                fs.renameSync(file.uploadImg[i].path, __dirname + "/../allLoadFile/" + file.uploadImg[i].name);
            })
        } else {
            fs.renameSync(file.uploadImg.path, __dirname + "/../allLoadFile/" + file.uploadImg.name);
        }
        //把用户编辑的资料（包括图片）都更新到数据库
        req.body.fileName = file.uploadImg.name;
        console.log('准备更新数据库（包括图片）');
        upDate('mycollection', {_id: ObjectId(req.body.userId)}, req.body, function (callback) {
            if (callback) {
                var mongodb = require('mongodb');
                var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
                var db = new mongodb.Db('heardatabase', server, {safe: true});
                db.open(function (err, db) {
                    if (!err) {
                        console.log('打开数据库成功！');
                        db.collection("mycollection", function (err, collection) {
                            if (err) {
                                throw err;
                                console.log("连接数据集合出错");
                            } else {
                                console.log("成功连接数据集合");
                                //find
                                collection.find({_id: ObjectId(req.body.userId)}).toArray(function (err, userInfo) {
                                    if (err) {
                                        throw err;
                                    }
                                    else {
                                        response.send({
                                            state: 200,
                                            data: userInfo
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
            }
        });
    } else {
        //上传内容仅仅是文字，不包括图片
        //把用户编辑的资料（仅仅是文本）都更新到数据库
        console.log('准备更新数据库（仅仅文本）');
        upDate('mycollection', {_id: ObjectId(req.body.userId)}, req.body, function (callback) {
            if (callback) {
                var mongodb = require('mongodb');
                var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
                var db = new mongodb.Db('heardatabase', server, {safe: true});
                db.open(function (err, db) {
                    if (!err) {
                        console.log('打开数据库成功！');
                        db.collection("mycollection", function (err, collection) {
                            if (err) {
                                throw err;
                                console.log("连接数据集合出错");
                            } else {
                                console.log("成功连接数据集合");
                                //find
                                collection.find({_id: ObjectId(req.body.userId)}).toArray(function (err, userInfo) {
                                    if (err) {
                                        throw err;
                                    }
                                    else {
                                        response.send({
                                            state: 200,
                                            data: userInfo
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
            }
        });
    }
});

module.exports = router;