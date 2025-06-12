// services/reportBuilder.js
import puppeteer from "puppeteer";
import db from "../database/db.js";

export const generateDepartmentReport = async (deptId) => {
  const [[department]] = await db.query("SELECT * FROM department WHERE deptid = ?", [deptId]);
  const [faculty] = await db.query("SELECT * FROM faculty WHERE department = ?", [deptId]);
  const [subjects] = await db.query("SELECT * FROM subject WHERE department = ?", [deptId]);

  const html = `
    <div>
      <h1>${department.deptName} Department Report</h1>
      <p>Total Faculties: ${faculty.length}</p>
      <p>Total Subjects: ${subjects.length}</p>
    </div>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({ format: "A4" });
  await browser.close();

  return pdf;
};
