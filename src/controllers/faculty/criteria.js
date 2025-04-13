import db from "../../database/db.js";

export const getAllCriteria = async (req, res) => {
  try {
    const [criteria] = await db.query("SELECT * FROM criteria");
    res.status(200).json(criteria);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch criteria" });
  }
};

// cid	criteriaName

export const addCriteria = async (req, res) => {
  const { criteriaName } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO criteria (criteriaName) VALUES (?)",
      [criteriaName]
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to add criteria" });
  }
};

export const updateCriteria = async (req, res) => {
  const { cid, criteriaName } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE criteria SET criteriaName = ? WHERE cid = ?",
      [criteriaName, cid]
    );
    if (result.length === 0) {
      return res.status(404).json({ error: "Criteria not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update criteria" });
  }
};

export const deleteCriteria = async (req, res) => {
  const { cid } = req.params;
  try {
    const [result] = await db.query(
      "DELETE FROM criteria WHERE cid = ?",
      [cid]
    );
    if (result.length === 0) {
      return res.status(404).json({ error: "Criteria not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete criteria" });
  }
};

export const getCriteriaById = async (req, res) => {
  const { cid } = req.params;
  try {
    const [result] = await db.query(
      "SELECT * FROM criteria WHERE cid = ?",
      [cid]
    );
    if (result.length === 0) {
      return res.status(404).json({ error: "Criteria not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch criteria" });
  }
};
