import express from "express";
import db from "../database/db.js";
import pdfkit from "pdfkit";

const router = express.Router();

// Helper: query entity list
const queryEntity = async (table, idCol = "id", nameCol = "name") => {
  const sql = `SELECT ${idCol} AS id, ${nameCol} AS name FROM ${table}`;
  const [rows] = await db.query(sql);
  return rows;
};

// List endpoints for all entities:
router.get("/departments", async (req, res) => {
  try {
    const rows = await queryEntity("department", "deptid", "deptName");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

// ✅ Kept your route name as "/facultys"
router.get("/facultys", async (req, res) => {
  try {
    const rows = await queryEntity("faculty", "facid", "facName");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch faculties" });
  }
});

router.get("/students", async (req, res) => {
  try {
    const rows = await queryEntity("student", "regNo", "sName");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

router.get("/batches", async (req, res) => {
  try {
    const rows = await queryEntity("batch", "batchid", "batchName");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch batches" });
  }
});

// PDF generation for department
router.get("/pdf/department/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [[dept]] = await db.query(
      "SELECT deptid AS id, deptName AS name, description FROM department WHERE deptid = ?",
      [id]
    );

    if (!dept) return res.status(404).send("Department not found");

    const doc = new pdfkit();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=department_${id}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(20).text(`Department Report: ${dept.name}`, { underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`ID: ${dept.id}`);
    doc.text(`Description: ${dept.description || "N/A"}`);

    doc.end();
  } catch (e) {
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

// ✅ Kept as /pdf/facultys/:id
router.get("/pdf/facultys/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const [[fac]] = await db.query(
      "SELECT facid AS id, facName AS name, email FROM faculty WHERE facid = ?",
      [id]
    );

    if (!fac) {
      return res.status(404).json({ error: `Faculty not found for id: ${id}` });
    }

    const doc = new pdfkit();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=faculty_${id}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(20).text(`Faculty Report: ${fac.facName}`, { underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`ID: ${fac.facid}`);
    doc.text(`Email: ${fac.email || "N/A"}`);
    doc.text(`Additional Info: To be added`);

    doc.end();
  } catch (e) {
    console.error("PDF generation error:", e);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

// Student PDF generation
router.get("/pdf/student/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [[student]] = await db.query(
      "SELECT regNo AS id, sName AS name, email FROM student WHERE regNo = ?",
      [id]
    );

    if (!student) return res.status(404).send("Student not found");

    const doc = new pdfkit();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=student_${id}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(20).text(`Student Report: ${student.name}`, { underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`ID: ${student.id}`);
    doc.text(`Email: ${student.email || "N/A"}`);

    doc.end();
  } catch (e) {
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

export default router;
