var Sql = {
  //新增-修改
  InsertSql:
    "INSERT INTO crawler(ID,Title,Content,CreatUsr,CreatDate,up_counts,down_counts,status,source,link,dateat) VALUES(?,?,?,?,?,?,?,?,?,?,?) on DUPLICATE KEY UPDATE ID=? ,up_counts=?,down_counts=?",
    SelectSql:"select * from crawler where ID=? order by ID desc"
};

module.exports = Sql;
