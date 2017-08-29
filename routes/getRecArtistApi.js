/**
 * Created by lx on 2016/11/2.
 */
var express = require('express');
var router = express.Router();
var url = require('url');

router.get('/getRecArtistApi', function (req, res) {
    console.log('推荐歌手');
    var  mongodb = require('mongodb');
    //var ObjectID = require('mongodb').ObjectID;
    var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
    var  db = new mongodb.Db('heardatabase', server, {safe:true});
    function queryData(targetCollection,callback) {
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
                        collection.find().sort({"visitor":-1,"timeStamp":-1}).limit(10).toArray(function (err, docs) {
                            if (err) {
                                throw err;
                            }
                            else {
                                //console.log(docs);
                                callback(docs);
                            }

                            //data = docs;
                            //aa(docs);
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

    queryData('allArtists',function (callback) {
        if (callback.length == 0) {
            res.send({
                state: 0
            });
        } else {
            res.send({
                state: 200,
                data:callback
            });
        }
    });
});

module.exports = router;