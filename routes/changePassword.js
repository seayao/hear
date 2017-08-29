/**
 * Created by Administrator on 2017/4/23.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;

var queryData = require('../data/queryData');
var upDate = require('../data/upDate');

router.post('/changePassword', function (req, response) {
    console.log('修改密码');
    //修改密码时，查询数据库，
    queryData('mycollection', {_id: ObjectId(req.body.userId)}, function (userInfo) {
        var userPwd = userInfo[0].userPwd;
        if (userPwd == req.body.oldPwd) {
            if (userPwd == req.body.newPwd) {
                response.send({
                    state: 1
                });
            } else {
                userInfo[0].userPwd = req.body.newPwd;
                upDate('mycollection', {_id: ObjectId(req.body.userId)},userInfo[0], function (callback) {
                    response.send({
                        state: 200
                    });
                });
            }
        } else if (userPwd != req.body.oldPwd) {
            response.send({
                state: 0
            });
        }
    });
});

module.exports = router;