import db from "../../database/db.js";

export const getAllDegrees = async (req, res) => {
  try {
    const degrees = await db.query("SELECT * FROM degrees");
    res.status(200).json(degrees.rows);
  } catch (error) {
    console.error("Error fetching degrees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDegreeById = async (req, res) => {
  const degreeId = req.params.id;
  try {
    const degree = await db.query("SELECT * FROM degrees WHERE degid = $1", [
      degreeId,
    ]);
    if (degree.rows.length === 0) {
      return res.status(404).json({ error: "Degree not found" });
    }
    res.status(200).json(degree.rows[0]);
  } catch (error) {
    console.error("Error fetching degree:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Degree has branch, degid, degName, duration, gradutaion, department, degreeType, degreeCode, degreeLevel, degreeStatus
export const createDegree = async (req, res) => {
  const { branch, degid, degName, duration, graduation, department } = req.body;

  try {
    const newDegree = await db.query(
      "INSERT INTO degrees (branch, degid, degName, duration, graduation, department) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        branch,
        degid,
        degName,
        duration,
        graduation,
        department,
        degreeType,
        degreeCode,
        degreeLevel,
        degreeStatus,
      ]
    );
    res.status(201).json(newDegree.rows[0]);
  } catch (error) {
    console.error("Error creating degree:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateDegree = async (req, res) => {
  const degreeId = req.params.id;
  const { branch, degid, degName, duration, graduation, department } = req.body;

  try {
    const updatedDegree = await db.query(
      "UPDATE degrees SET branch = $1, degid = $2, degName = $3, duration = $4, graduation = $5, department = $6 WHERE degid = $7 RETURNING *",
      [branch, degid, degName, duration, graduation, department, degreeId]
    );
    if (updatedDegree.rows.length === 0) {
      return res.status(404).json({ error: "Degree not found" });
    }
    res.status(200).json(updatedDegree.rows[0]);
  } catch (error) {
    console.error("Error updating degree:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteDegree = async (req, res) => {
  const degreeId = req.params.id;
  try {
    const deletedDegree = await db.query(
      "DELETE FROM degrees WHERE degid = $1 RETURNING *",
      [degreeId]
    );
    if (deletedDegree.rows.length === 0) {
      return res.status(404).json({ error: "Degree not found" });
    }
    res.status(200).json(deletedDegree.rows[0]);
  } catch (error) {
    console.error("Error deleting degree:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
