/**
 * Created by lx on 2016/10/25.
 */
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db = new mongodb.Db('heardatabase', server, {safe:true});
function upDate(targetCollection,upDataBefore,upDataAfter,callback){
    db.open(function(err, db){
        if(!err){
            console.log('打开数据库成功！');
            db.collection(targetCollection,function(err,collection){
                if(err){
                    throw err;
                    console.log("连接数据集合出错");
                }else{
                    console.log("成功连接数据集合");
                    //更新
                    //{$set:upDataAfter}
                    collection.update(upDataBefore,{$set:upDataAfter},function(err,res){
                        if(err){
                            throw err;
                        }else{
                            console.log("成功更新"+JSON.parse(res).n+"条数据");
                            collection.find({}).toArray(function(err,docs){
                                if(err)
                                    throw err;
                                else
                                    //console.log(docs);
                                callback(docs);
                                db.close();
                            });
                        }
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

module.exports = upDate;