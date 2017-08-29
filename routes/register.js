var express = require('express');
var router = express.Router();
var url = require('url');

var queryData = require('../data/queryData');
var insertData = require('../data/insertData');

router.post('/register', function(req, response) {
    console.log('进入注册');
    var date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.day = date.getDate();
    var regTime = this.year+"-"+this.month+"-"+this.day;
    var userCollection = {
        userPhone:req.body.userPhone,
        userPwd:req.body.userPwd,
        timeStamp:date.getTime(),
        regTime:regTime,
        sex:"1",
        userType:"0",
        vipGrade:"0",
        userState:"0"
    };
    //注册时，查询数据库，防止重复注册
    queryData('mycollection',
        {
            'userPhone':userCollection.userPhone
        },
        function (callback){
            if(callback.length >= 1){
                //res.end('false');
                response.send({
                    state:1,
                    userMsg:callback
                });
                console.log('提示：用户已存在，用户信息如下：',callback);
            }else {
                insertData('mycollection', userCollection ,function(regUser){
                    console.log(regUser);
                    if(regUser.result.ok == 1){
                        response.send({
                            state:200
                        });
                    }
                });
            }
        });
});

module.exports = router;