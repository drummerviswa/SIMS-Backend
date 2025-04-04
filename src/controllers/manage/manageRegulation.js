import db from "../../database/db.js";

//`rid`, `regName`, `start`, `end`

export const getAllRegulations = async (req, res) => {
  try {
    const regulations = await db.query("SELECT * FROM regulations");
    res.status(200).json(regulations[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching regulations", error });
  }
};

export const getRegulationById = async (req, res) => {
  const { rid } = req.params;
  try {
    const regulation = await db.query(
      "SELECT * FROM regulations WHERE rid = ?",
      [rid]
    );
    if (regulation[0].length === 0) {
      return res.status(404).json({ message: "Regulation not found" });
    }
    res.status(200).json(regulation[0][0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching regulation", error });
  }
};

export const addRegulation = async (req, res) => {
  const { regName, start, end } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO regulations (regName, start, end) VALUES (?, ?, ?)",
      [regName, start, end]
    );
    res.status(201).json({ message: "Regulation added", rid: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error adding regulation", error });
  }
};

export const updateRegulation = async (req, res) => {
  const { rid } = req.params;
  const { regName, start, end } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE regulations SET regName = ?, start = ?, end = ? WHERE rid = ?",
      [regName, start, end, rid]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Regulation not found" });
    }
    res.status(200).json({ message: "Regulation updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating regulation", error });
  }
};

export const deleteRegulation = async (req, res) => {
  const { rid } = req.params;
  try {
    const [result] = await db.query("DELETE FROM regulations WHERE rid = ?", [
      rid,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Regulation not found" });
    }
    res.status(200).json({ message: "Regulation deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting regulation", error });
  }
};
export const getRegulationByName = async (req, res) => {
  const { regName } = req.params;
  try {
    const regulation = await db.query(
      "SELECT * FROM regulations WHERE regName = ?",
      [regName]
    );
    if (regulation[0].length === 0) {
      return res.status(404).json({ message: "Regulation not found" });
    }
    res.status(200).json(regulation[0][0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching regulation", error });
  }
};
