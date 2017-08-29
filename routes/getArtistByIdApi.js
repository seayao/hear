/**
 * Created by Administrator on 2017/4/25.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var queryData = require('../data/queryData');

router.post('/getArtistByIdApi', function(req, res) {
    console.log('歌手详情');
    queryData('allArtists', {_id:ObjectId(req.body.artistId)},function(artistInfo){
        if(artistInfo.length > 0){
            res.send({
                state:200,
                data:artistInfo
            });
        }else {
            res.send({
                state:0
            });
        }
    });
});

module.exports = router;