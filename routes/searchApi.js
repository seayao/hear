/**
 * Created by lx on 2016/11/10.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var queryData = require('../data/queryData');

//删除数组中下标为n的元素
function removeArrayOfN(arr, n) {
    if (n > arr.length - 1 || n < 0) {
        //如果n大于或小于指定数组的长度则返回
        return;
    }
    var arr1 = [];
    for (var i = 0; i < arr.length; i++) {
        if (i == n) {
            continue
        }//如果删除的为第i个元素，跳出当前循环
        arr1.push(arr[i]);//把下标不为n的元素添加到arr1
    }
    arr.length = 0;//将arr的长度设为零
    for (var i = 0; i < arr1.length; i++) {
        arr[i] = arr1[i]//重新给arr赋值
    }
    return arr;//返回传进的数组
}

router.post('/searchApi', function (req, res) {
    console.log('开启搜索');
    var searchVal = req.body.searchVal;
    var searchNum;
    //搜索歌曲相关
    queryData('allSongs', {"songName": {$regex: searchVal, $options: 'i'}}, function (docSong) {
        var mongodb = require('mongodb');
        var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
        var db = new mongodb.Db('heardatabase', server, {safe: true});
        db.open(function (err, db) {
            if (!err) {
                console.log('打开数据库成功！');
                //搜索歌手相关
                db.collection("allArtists", function (err, collection) {
                    if (err) {
                        throw err;
                        console.log("连接数据集合出错");
                    } else {
                        console.log("成功连接数据集合");
                        //find
                        collection.find({
                            "artistName": {
                                $regex: searchVal,
                                $options: 'i'
                            }
                        }).sort({"timeStamp": -1}).toArray(function (err, docArtist) {
                            if (err) {
                                throw err;
                            }
                            else {
                                //搜索用户相关
                                db.collection("mycollection", function (err, collection) {
                                    if (err) {
                                        throw err;
                                        console.log("连接数据集合出错");
                                    } else {
                                        console.log("成功连接数据集合");
                                        //find
                                        collection.find({
                                            "nickname": {
                                                $regex: searchVal,
                                                $options: 'i'
                                            }
                                        }).sort({"timeStamp": -1}).toArray(function (err, docUser) {
                                            if (err) {
                                                throw err;
                                            }
                                            else {
                                                searchNum = docSong.length + docArtist.length + docUser.length;
                                                if (searchNum <= 0) {
                                                    res.send({
                                                        state: 0
                                                    });
                                                } else {
                                                    docUser.forEach(function (v, i, a) {
                                                        if (v.userType == 1) {
                                                            docUser = removeArrayOfN(docUser, i);
                                                        }
                                                    });
                                                    searchNum = docSong.length + docArtist.length + docUser.length;
                                                    res.send({
                                                        state: 200,
                                                        total: searchNum,
                                                        song: docSong,
                                                        artist: docArtist,
                                                        user: docUser
                                                    });
                                                }
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