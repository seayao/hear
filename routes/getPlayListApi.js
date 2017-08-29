/**
 * Created by Administrator on 2017/4/30.
 */
var express = require('express');
var router = express.Router();
var url = require('url');

router.post('/getPlayListApi', function (req, res) {
    console.log('播放列表歌曲');
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

    queryData('playList', {'userId':req.body.userId}, function (callback){
        if(callback.length >= 1){
            res.send({
                state:200,
                data:callback
            });
        }else {
            res.send({
                state:0
            });
        }
    });
});

module.exports = router;