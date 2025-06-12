import fs from "fs";
import path from "path";
import archiver from "archiver";
import mysqldump from "mysqldump";
import ExcelJS from "exceljs";
import moment from "moment";
import dotenv from "dotenv";
import db from "../database/db.js";

dotenv.config();

const BACKUP_DIR = path.resolve("backups");
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR);

function getTimestamp() {
  return moment().format("YYYY-MM-DD_HH-mm-ss");
}

function sanitizeSheetName(name) {
  return name.slice(0, 31).replace(/[^a-zA-Z0-9_\-]/g, "") || "Sheet";
}

export async function dumpSQL(filePath) {
  await mysqldump({
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    dumpToFile: filePath,
  });
  return filePath;
}

export async function exportToExcel(filePath) {
  const workbook = new ExcelJS.Workbook();
  const [tables] = await db.query("SHOW TABLES");
  const tableNames = tables.map((row) => Object.values(row)[0]);

  for (const table of tableNames) {
    const [rows] = await db.query(`SELECT * FROM \`${table}\``);
    const sheet = workbook.addWorksheet(sanitizeSheetName(table));

    if (rows.length > 0) {
      sheet.columns = Object.keys(rows[0]).map((key) => ({
        header: key,
        key,
        width: 20,
      }));
      rows.forEach((row) => sheet.addRow(row));
    }
  }

  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

export async function zipFiles(zipFile, files) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipFile);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve(zipFile));
    archive.on("error", (err) => reject(err));

    archive.pipe(output);

    files.forEach((file) => {
      if (fs.existsSync(file)) {
        archive.file(file, { name: path.basename(file) });
      }
    });

    archive.finalize();
  });
}

export async function runBackup() {
  const timestamp = getTimestamp();
  const sqlPath = path.join(BACKUP_DIR, `backup_${timestamp}.sql`);
  const xlsxPath = path.join(BACKUP_DIR, `backup_${timestamp}.xlsx`);
  const zipPath = path.join(BACKUP_DIR, `backup_${timestamp}.zip`);

  await dumpSQL(sqlPath);
  await exportToExcel(xlsxPath);
  await zipFiles(zipPath, [sqlPath, xlsxPath]);

  return { sqlFile: sqlPath, xlsxFile: xlsxPath, zipFile: zipPath };
}
