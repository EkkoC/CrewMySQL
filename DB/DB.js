const mysql = require("mysql");
const config = require("./config");//DB 設定黨

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  port: config.port,
  connectionLimit: 10
});



var db = {};




db.query=function(sql,params,callback){

  pool.getConnection(function(err, connection) {
    if (err) {
      callback(err,null);
      return;
    }; //無連線
    //連線
    connection.query(sql,params, function(error, results, fields) {
     //console.log('msg :',`${sql}=>${params}`); 
     connection.release();

     callback(error,results);
      
    });
  });
  
}

module.exports=db