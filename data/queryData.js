//var mongoose = require('mongoose');
//var db = mongoose.connect('mongodb://localhost/chihuo');//；连接数据库
//var Schema = mongoose.Schema;   //  创建模型
//var userScheMa = new Schema({
//	name: String,
//	password: String
//}); //  定义了一个新的模型，但是此模式还未和users集合有关联
//exports.user = db.model('users', userScheMa); //  与users集合关联
var  mongodb = require('mongodb');
//var ObjectID = require('mongodb').ObjectID;
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db = new mongodb.Db('heardatabase', server, {safe:true});
function queryData(targetCollection,querySelection,callback) {
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
					collection.find(querySelection).toArray(function (err, docs) {
						if (err) {
							throw err;
						}
						else {
							//console.log(docs);
							callback(docs);
						}

						//data = docs;
					//aa(docs);
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

module.exports = queryData;
