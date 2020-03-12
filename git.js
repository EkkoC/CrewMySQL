
//爬蟲套件
const request = require("request"); //npm install request cheerio
const fs = require("fs"); //npm install ramda

//時間套件
const dateFormat = require("moment");


//實現SQL交互
const mysql = require("mysql");
const Sql = require("./DB/sql");//擴充SQL語句
const db=require('./DB/DB');//DB模組



const getSelenium = function() {
  let currentDateTime = dateFormat(new Date()).format("YYYY/MM/DD HH:mm:ss");
  let dateS = dateFormat(new Date()).format("YYYYMMDD");
  let dateS1 = dateFormat(new Date()).format("YYYY/MM/DD ");
  let dateSs = dateFormat(new Date()).format("HHmmss");
  let date = dateS + dateSs;

  //console.log(date);
  request(
    {
      url:
        "https://api.jinse.com/v4/live/list?limit=20&reading=false&source=web&sort=&flag=down&id=0",  //爬蟲web
      json: true,
      method: "GET"
    },
    function(error, response, body) {
      if (error || !body) {
        return;
      }
      const result = []; // 建立一個儲存結果的容器
    
      for (var i = 0; i < 20; i++) {
  
        const id_N = body["list"][0].lives[i].id;
        const responsea = body["list"][0].lives[i].content;
        const up_counts = body["list"][0].lives[i].up_counts;
        const down_counts = body["list"][0].lives[i].down_counts;
        const Content1 = responsea.split("】");
        const Content2 = Content1[1];
        const title1 = Content1[0].split("【");
        const Title = title1[1];
        const CreatUsr = "API";
        const status= "true";
        const source="1";  //1代表金色財經
        let dateat=body["list"][0].lives[i].created_at;//發布時間
        let dateat12 = dateFormat(dateat).format("HH:mm:ss");//發布時間
        let dateat1 = dateS1+dateat12;
        const link="https://www.jinse.com/lives/"+id_N+".html";//來源網址
        result.push(
          Object.assign({ id_N, Title, Content2, CreatUsr, currentDateTime,up_counts,down_counts,status,source,link,dateat1 })
        );
      }

      for (var data in result) {
        var params = [
          result[data].id_N,
          result[data].Title,
          result[data].Content2,
          result[data].CreatUsr,
          result[data].currentDateTime,
          result[data].up_counts,
          result[data].down_counts,
          result[data].status,

          result[data].source,
          result[data].link,
          result[data].dateat1,
  

          result[data].id_N,
          result[data].up_counts,
          result[data].down_counts
        ];
       

      db.query(Sql.InsertSql, params, function(err, response) {
          if (err) {
            console.log('[INSERT ERROR] - ',err.message);
            fs.writeFileSync("ERROR" + date + ".json", err.message);
            return;
          }
        });
      }
      //fs.writeFileSync("result" + date + ".json", JSON.stringify(result));
    }
  );
};

getSelenium();
// 每秒爬一次資料
setInterval(getSelenium, 1 * 60 * 1000);
