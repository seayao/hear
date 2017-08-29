/**
 * Created by lx on 2016/11/2.
 */
var express = require('express');
var router = express.Router();
var url = require('url');

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

router.get('/getMemberApi', function (req, res) {
    console.log('会员展示');
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
                        collection.find().sort({"timeStamp":-1}).toArray(function (err, docs) {
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

    queryData('mycollection',function (userList) {
        if (userList.length <= 0) {
            res.send({
                state: 0
            });
        } else {
            userList.forEach(function (v, i, a) {
                if (v.userType == 1) {
                    userList = removeArrayOfN(userList, i);
                }
            });
            res.send({
                state: 200,
                data:userList
            });
        }
    });
});

module.exports = router;