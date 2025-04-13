import db from "../../database/db.js";

//	acid	l	t	p	c	assess1	assess2	endsem	cperiod	type	regulation

export const getAllAssessComps = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT a.*,r.regName FROM assesscomp AS a JOIN regulations AS r ON r.rid = a.regulation"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAssessCompById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT a.*,r.regName FROM assesscomp AS a JOIN regulations AS r ON r.rid = a.regulation WHERE a.acid = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "AssessComp not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createAssessComp = async (req, res) => {
  const {
    l,
    t,
    p,
    c,
    assess1,
    assess2,
    endsem,
    cperiod,
    type,
    regulation,
    written,
    assignment,
  } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO assesscomp (l, t, p, c, assess1, assess2, endsem, cperiod, type, regulation,written,assignment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        l,
        t,
        p,
        c,
        assess1,
        assess2,
        endsem,
        cperiod,
        type,
        regulation,
        written,
        assignment,
      ]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAssessComp = async (req, res) => {
  const { id } = req.params;
  const {
    l,
    t,
    p,
    c,
    assess1,
    assess2,
    endsem,
    cperiod,
    type,
    regulation,
    written,
    assignment,
  } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE assesscomp SET l = ?, t = ?, p = ?, c = ?, assess1 = ?, assess2 = ?, endsem = ?, cperiod = ?, type = ?, regulation = ?,written =?, assignment=? WHERE acid = ?",
      [
        l,
        t,
        p,
        c,
        assess1,
        assess2,
        endsem,
        cperiod,
        type,
        regulation,
        written,
        assignment,
        id,
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "AssessComp not found" });
    }
    res.status(200).json({ message: "AssessComp updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAssessComp = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM assesscomp WHERE acid = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "AssessComp not found" });
    }
    res.status(200).json({ message: "AssessComp deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAssessCompByRegulation = async (req, res) => {
  const { regulation } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM assesscomp WHERE regulation = ?",
      [regulation]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "AssessComp not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
