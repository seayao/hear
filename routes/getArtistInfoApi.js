/**
 * Created by lx on 2016/11/10.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var queryData = require('../data/queryData');

router.post('/getArtistInfoApi', function (req, res) {
    console.log('开始查询');
    var artistId = req.body._id;
    queryData('allArtists', {_id: ObjectId(artistId)}, function (docDetails) {
        if(docDetails[0]){
            var mongodb = require('mongodb');
            var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
            var db = new mongodb.Db('heardatabase', server, {safe: true});
            db.open(function (err, db) {
                if (!err) {
                    console.log('打开数据库成功！');
                    //查询评论
                    db.collection("comment", function (err, collection) {
                        if (err) {
                            throw err;
                            console.log("连接数据集合出错");
                        } else {
                            console.log("成功连接数据集合");
                            //find
                            collection.find({beCommentId: artistId}).sort({"timeStamp":-1}).toArray(function (err, docComment) {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    res.send({
                                        state: 200,
                                        details: docDetails,
                                        comment: docComment
                                    });
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
        }else {
            res.send({
                state: -1
            });
        }
    });
});


module.exports = router;