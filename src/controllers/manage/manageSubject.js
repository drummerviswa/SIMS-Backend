import db from "../../database/db.js";

//subid	subName	credits	subCode	category	regulation	internal	lecture	practical	tutorial	totalHours	totalMarks	external

export const getAllSubjects = async (req, res) => {
  try {
    const [subjects] = await db.query("SELECT * FROM subjects");
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
      "SELECT * FROM subjects WHERE subid = ?",
      [subid]
    );
    if (subject.length === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(subject);
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createSubject = async (req, res) => {
  const {
    subName,
    credits,
    subCode,
    category,
    regulation,
    internal,
    lecture,
    practical,
    tutorial,
    totalHours,
    totalMarks,
    external,
  } = req.body;
  try {
    if (
      !subName ||
      !credits ||
      !subCode ||
      !category ||
      !regulation ||
      !internal ||
      !lecture ||
      !practical ||
      !tutorial ||
      !totalHours ||
      !totalMarks ||
      !external
    ) {
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
      "INSERT INTO subjects (subName, credits, subCode, category, regulation, internal, lecture, practical, tutorial, totalHours, totalMarks, external) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        subName,
        credits,
        subCode,
        category,
        regulation,
        internal,
        lecture,
        practical,
        tutorial,
        totalHours,
        totalMarks,
        external,
      ]
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
  const {
    subName,
    credits,
    subCode,
    category,
    regulation,
    internal,
    lecture,
    practical,
    tutorial,
    totalHours,
    totalMarks,
    external,
  } = req.body;
  try {
    const [updatedSubject] = await db.query(
      "UPDATE subjects SET subName = ?, credits = ?, subCode = ?, category = ?, regulation = ?, internal = ?, lecture = ?, practical = ?, tutorial = ?, totalHours = ?,totalMarks = ? ,external = ? WHERE subid = ?",
      [
        subName,
        credits,
        subCode,
        category,
        regulation,
        internal,
        lecture,
        practical,
        tutorial,
        totalHours,
        totalMarks,
        external,
        subid,
      ]
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
