import { Router } from "express";
import PDFDocument from "pdfkit";
import db from "../database/db.js";

const router = Router();

router.get("/:type/:id", async (req, res) => {
  const { type, id } = req.params;

  const tableMap = {
    department: { table: "department", key: "deptid", nameField: "deptName" },
    faculty: { table: "faculty", key: "facid", nameField: "facultyName" },
    student: { table: "students", key: "regNo", nameField: "studentName" },
  };

  const config = tableMap[type];
  if (!config) {
    return res.status(400).send("Invalid entity type");
  }

  try {
    const [rows] = await db.query(
      `SELECT * FROM ${config.table} WHERE ${config.key} = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).send("Record not found");
    }

    const record = rows[0];

    // Generate PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${type}_${id}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text(`${type.toUpperCase()} Report`, { align: "center" });
    doc.moveDown();

    Object.entries(record).forEach(([key, value]) => {
      doc.fontSize(12).text(`${key}: ${value}`);
    });

    doc.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Failed to generate PDF");
  }
});

export default router;
