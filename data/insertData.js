/**
 * Created by lx on 2016/10/19.
 */
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db = new mongodb.Db('heardatabase', server, {safe:true});
function insertData(targetCollection,targetData,callback){
    db.open(function(err, db){
        if(!err){
            console.log('打开数据库成功！');
            db.collection(targetCollection,function(err,collection){
                if(err){
                    throw err;
                    console.log("连接数据集合出错");
                }else{
                    console.log("成功连接数据集合");
                    //insert
                    collection.insert(targetData,function(err,docs){
                        if(!err){
                            callback(docs);
                        }
                        db.close();
                    });
                }
            });
        }
        else{
            console.log('打开数据库失败！');
            console.log(err);
        }
    });
}

module.exports = insertData;