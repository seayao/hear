/**
 * Created by Administrator on 2017/4/25.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;

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

var queryData = require('../data/queryData');

router.post('/lockUserApi', function (req, response) {
    console.log('禁用或解封用户');
    queryData('mycollection', {_id: ObjectId(req.body.userId)}, function (userInfo) {
        userInfo[0].userState = req.body.userState;
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
                                collection.find({}).sort({"timeStamp": -1}).toArray(function (err, userList) {
                                    if (err)
                                        throw err;
                                    else if (userList.length <= 0) {
                                        response.send({
                                            state: 0
                                        });
                                    } else {
                                        userList.forEach(function (v, i, a) {
                                            if (v.userType == 1) {
                                                userList = removeArrayOfN(userList, i);
                                            }
                                        });
                                        response.send({
                                            state: 200,
                                            data: userList
                                        });
                                    }
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