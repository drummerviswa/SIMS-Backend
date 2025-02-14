import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();
export const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
export function connectionCheck() {
  return new Promise((resolve, reject) => {
    db.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        reject(err);
      } else {
        resolve("success");
      }
    });
  });
}
export function connectionRelease() {
  db.on("release", function (connection) {
    console.log("Connection %d released", connection.threadId);
  });
}
