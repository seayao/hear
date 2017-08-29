/**
 * Created by Administrator on 2017/4/24.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var queryData = require('../data/queryData');

router.post('/postSongListenerApi', function(req, response) {
    console.log("歌曲收听量");
    var songId = req.body.songId;
    queryData('allSongs', {_id:ObjectId(songId)},function(songInfo){
        songInfo[0].listener = parseInt(songInfo[0].listener) + 1;
        //更新收听量
        var mongodb = require('mongodb');
        var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
        var db = new mongodb.Db('heardatabase', server, {safe: true});
        db.open(function (err, db) {
            if (!err) {
                console.log('打开数据库成功！');
                db.collection('allSongs', function (err, collection) {
                    if (err) {
                        throw err;
                        console.log("连接数据集合出错");
                    } else {
                        console.log("成功连接数据集合");
                        //更新
                        //{$set:upDataAfter}
                        collection.update({_id:ObjectId(songId)}, {$set: songInfo[0]}, function (err, res) {
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
                                            data:docs
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