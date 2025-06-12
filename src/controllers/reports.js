// controllers/reports.js
import db from "../database/db.js";

export const getSummary = async (req, res) => {
  try {
    const [[departments]] = await db.query("SELECT COUNT(*) AS count FROM department");
    const [[faculties]] = await db.query("SELECT COUNT(*) AS count FROM faculty");
    const [[students]] = await db.query("SELECT COUNT(*) AS count FROM student");
    const [[subjects]] = await db.query("SELECT COUNT(*) AS count FROM subject");
    const [[grievances]] = await db.query("SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved FROM grievances");

    res.json({
      departments: departments.count,
      faculties: faculties.count,
      students: students.count,
      subjects: subjects.count,
      grievances: {
        total: grievances.total,
        resolved: grievances.resolved,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summary", details: err.message });
  }
};

// controllers/reports.js
import { generateDepartmentReport } from "../services/reportBuilder.js";

export const departmentPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const pdfBuffer = await generateDepartmentReport(id);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="department-${id}-report.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate PDF", details: err.message });
  }
};
