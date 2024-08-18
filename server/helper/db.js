const mysql = require("mysql2");
let db;
const logger = require("../loggerDBError");

function handleDisconnection() {
  db = mysql.createConnection({
    host: "106.14.207.119",
    user: "root",
    password: "Zhl20020203",
    database: "videoweb",
    port: "3306",
  });
  db.connect((err) => {
    if (err) {
      setTimeout(() => {
        handleDisconnection();
      }, 2000);
    }
  });

  db.on("error", function (err) {
    logger.error("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      logger.error("db error执行重连:" + err.message);
      handleDisconnection();
    } else {
      throw err;
    }
  });
}
handleDisconnection();

module.exports = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
