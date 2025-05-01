import express from "express";
const router = express.Router();
import db from "../../database/db.js"; // your mysql2 connection

router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM academicPeriod");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { title, start, end, level } = req.body;
  const [result] = await db.query(
    "INSERT INTO academicPeriod (title, start, end, level) VALUES (?, ?, ?, ?)",
    [title, start, end, level]
  );
  res.json({ id: result.insertId, title, start, end, level });
});

router.put("/:id", async (req, res) => {
  const { title, start, end, level } = req.body;
  await db.query(
    "UPDATE academicPeriod SET title=?, start=?, end=?, level=? WHERE id=?",
    [title, start, end, level, req.params.id]
  );
  res.sendStatus(200);
});

router.delete("/:id", async (req, res) => {
  await db.query("DELETE FROM academicPeriod WHERE id=?", [req.params.id]);
  res.sendStatus(200);
});
export default router;
