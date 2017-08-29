/**
 * Created by lx on 2016/11/2.
 */
var express = require('express');
var router = express.Router();
var url = require('url');

var queryData = require('../data/queryData');

router.post('/login', function(req, res) {
    console.log('进入登录');
    var userCollection = {
        userPhone:req.body.userPhone,
        userPwd:req.body.userPwd
    };
    queryData('mycollection',
        {
            'userPhone':userCollection.userPhone,
            'userPwd':userCollection.userPwd
        },
        function (callback){
            if (callback.length != 1){
                res.send({
                    state:0
                });
                console.log('提示：用户名或密码错误');
            }else if (callback.length == 1 && callback[0].userState == 0){
                res.send({
                    state:200,
                    userMsg:callback[0]
                });
            }else if(callback.length == 1 && callback[0].userState == -1){
                res.send({
                    state:-1
                });
                console.log('提示：您的帐号已被禁用');
            }
        });
});

module.exports = router;