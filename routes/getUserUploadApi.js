/**
 * Created by lx on 2016/11/10.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
//var queryData = require('../data/queryData');

router.post('/getUserUploadApi', function (req, response) {
    console.log('我的收藏、上传的歌曲和歌手');
    var userId = req.body.userId;
    var  mongodb = require('mongodb');
    //var ObjectID = require('mongodb').ObjectID;
    var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
    var  db = new mongodb.Db('heardatabase', server, {safe:true});
    function queryData(targetCollection,querySelection,callback) {
        db.open(function (err, db) {
            if (!err) {
                console.log('打开数据库成功！');
                db.collection(targetCollection, function (err, collection) {
                    if (err) {
                        throw err;
                        console.log("连接数据集合出错");
                    } else {
                        console.log("成功连接数据集合");
                        //find
                        collection.find(querySelection).sort({"timeStamp":-1}).toArray(function (err, docs) {
                            if (err) {
                                throw err;
                            }
                            else {
                                //console.log(docs);
                                callback(docs);
                            }
                            db.close();
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

    //查询我的收藏
    queryData('collect', {collectorId:userId}, function (docCollect) {
        var mongodb = require('mongodb');
        var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
        var db = new mongodb.Db('heardatabase', server, {safe: true});
        db.open(function (err, db) {
            if (!err) {
                console.log('打开数据库成功！');
                //查询我上传的歌曲
                db.collection("allSongs", function (err, collection) {
                    if (err) {
                        throw err;
                        console.log("连接数据集合出错");
                    } else {
                        console.log("成功连接数据集合");
                        //find
                        collection.find({userId:userId}).sort({"timeStamp":-1}).toArray(function (err, docUploadSong) {
                            if (err) {
                                throw err;
                            }
                            else {
                                //查询我上传的歌手
                                db.collection("allArtists", function (err, collection) {
                                    if (err) {
                                        throw err;
                                        console.log("连接数据集合出错");
                                    } else {
                                        console.log("成功连接数据集合");
                                        //find
                                        collection.find({userId: userId}).sort({"timeStamp": -1}).toArray(function (err, docUploadArtist) {
                                            if (err) {
                                                throw err;
                                            }
                                            else {
                                                response.send({
                                                    state: 200,
                                                    myCollect: docCollect,
                                                    uploadSong: docUploadSong,
                                                    uploadArtist: docUploadArtist
                                                });
                                            }
                                            db.close();
                                        });
                                    }
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