/**
 * Created by lx on 2016/11/8.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;

var queryData = require('../data/queryData');

router.post('/collectSongsApi', function (req, response) {
    var songId = req.body.beCollectId;
    var userId = req.body.collectorId;
    queryData('allSongs', {_id: ObjectId(songId)}, function (songInfo) {
        if (songInfo[0].whoCollect.indexOf(userId) > -1) {
            //返回值为1，表示收藏过
            response.send({
                state: 1
            });
        } else {
            //获取年月日
            var date = new Date();
            this.timeStamp = date.getTime();
            this.year = date.getFullYear();
            this.month = date.getMonth() + 1;
            this.day = date.getDate();
            req.body.createTime = this.year + "-" + this.month + "-" + this.day;
            req.body.timeStamp = this.timeStamp;
            //开始收藏
            var mongodb = require('mongodb');
            var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
            var db = new mongodb.Db('heardatabase', server, {safe: true});
            db.open(function (err, db) {
                if (!err) {
                    console.log('打开数据库成功！');
                    db.collection("collect", function (err, collection) {
                        if (err) {
                            throw err;
                            console.log("连接数据集合出错");
                        } else {
                            console.log("成功连接数据集合");
                            //insert
                            collection.insert(req.body, function (err, collectResult) {
                                if (!err) {
                                    if (collectResult.result.ok == 1) {
                                        //收藏成功，更新当前歌曲数据
                                        songInfo[0].collectNum = songInfo[0].collectNum + 1;
                                        songInfo[0].whoCollect.push(userId);
                                        db.collection("allSongs", function (err, collection) {
                                            if (err) {
                                                throw err;
                                                console.log("连接数据集合出错");
                                            } else {
                                                console.log("成功连接数据集合");
                                                //更新
                                                //{$set:upDataAfter}
                                                collection.update({_id: ObjectId(songId)}, {$set: songInfo[0]}, function (err, res) {
                                                    if (err) {
                                                        throw err;
                                                    } else {
                                                        console.log("成功更新" + JSON.parse(res).n + "条数据");
                                                        collection.find({}).toArray(function (err, docs) {
                                                            if (err)
                                                                throw err;
                                                            else
                                                            //console.log(docs);
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
});

module.exports = router;
