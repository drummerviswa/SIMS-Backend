import db from "../../database/db.js";

//subid	subName	credits	subCode	category	regulation	internal	lecture	practical	tutorial	totalHours	totalMarks	external

export const getAllSubjects = async (req, res) => {
  try {
    const [subjects] = await db.query(
      "SELECT s.*,a.*,r.regName FROM subjects AS s JOIN assesscomp AS a ON s.component = a.acid JOIN regulations AS r ON a.regulation = r.rid"
    );
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getSubjectById = async (req, res) => {
  const { subid } = req.params;
  try {
    const [subject] = await db.query(
      "SELECT r.regName,s.*,a.* FROM subjects AS s JOIN assesscomp AS a ON s.component = a.acid JOIN regulations AS r ON r.rid = a.regulation WHERE subid = ?",
      [subid]
    );
    if (subject.length === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(subject[0]);
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createSubject = async (req, res) => {
  const { subName, subCode, component } = req.body;
  try {
    if (!subName || !subCode || !component) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const [existingSubject] = await db.query(
      "SELECT * FROM subjects WHERE subCode = ?",
      [subCode]
    );
    if (existingSubject.length > 0) {
      return res.status(400).json({ message: "Subject code already exists" });
    }
    const [newSubject] = await db.query(
      "INSERT INTO subjects (subName, subCode, component) VALUES (?,?,?)",
      [subName, subCode, component]
    );
    res.status(201).json({
      message: "Subject created successfully",
      subject: newSubject,
    });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubject = async (req, res) => {
  const { subid } = req.params;
  const { subName, subCode, component } = req.body;
  try {
    const [updatedSubject] = await db.query(
      "UPDATE subjects SET subName = ?, subCode = ?, component = ? WHERE subid = ?",
      [subName, subCode, component, subid]
    );
    if (updatedSubject.length === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(updatedSubject);
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSubject = async (req, res) => {
  const { subid } = req.params;
  try {
    const [deletedSubject] = await db.query(
      "DELETE FROM subjects WHERE subid = ?",
      [subid]
    );
    if (deletedSubject.length === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubjectByDegree = async (req, res) => {
  const { degree } = req.params;
  try {
    const [subjects] = await db.query(
      "SELECT * FROM subjects WHERE category = ?",
      [degree]
    );
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubjectBySubCode = async (req, res) => {
  const { subCode } = req.params;
  try {
    const [subjects] = await db.query(
      "SELECT s.*,r.regName FROM subjects AS s JOIN assesscomp AS ac ON ac.acid = s.component JOIN regulations r ON ac.regulation=r.rid WHERE subCode = ?",
      [subCode]
    );
    res.status(200).json(subjects[0]);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRegulationBySubBatch = async (req, res) => {
  const { subCode, batchName } = req.params;
  try {
    const [regulation] = await db.query(
      `SELECT r.* FROM assesscomp AS ac 
      JOIN subjects AS s ON s.component = ac.acid
      JOIN subassign AS sa ON sa.subject = s.subid
      JOIN batch AS b ON sa.batch = b.batchid
      JOIN regulations AS r ON r.rid = ac.regulation
      WHERE s.subCode = ? AND b.batchName = ?
      `,
      [subCode, batchName]
    );
    res.status(200).json(regulation[0]);
  } catch (error) {
    console.error("Error fetching regulation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
