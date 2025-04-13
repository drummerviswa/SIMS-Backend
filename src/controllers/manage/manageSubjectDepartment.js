import db from "../../database/db.js";

//subid	subName	credits	subCode	category	regulation	internal	lecture	practical	tutorial	totalHours	totalMarks	external

export const getAllSubjects = async (req, res) => {
  const { deptid } = req.params;
  try {
    const [subjects] = await db.query(
      "SELECT s.*,a.*,r.regName FROM subjects AS s JOIN assesscomp AS a ON s.component = a.acid JOIN regulations AS r ON a.regulation = r.rid JOIN subject_department AS sd ON s.subid = sd.subject WHERE sd.department = ?",
      [deptid]
    );
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getSubjectById = async (req, res) => {
  const { subid, deptid } = req.params;
  try {
    const [subject] = await db.query(
      "SELECT r.regName,s.*,a.* FROM subjects AS s JOIN assesscomp AS a ON s.component = a.acid JOIN regulations AS r ON r.rid = a.regulation JOIN subject_department AS sd ON s.subid = sd.subject WHERE sd.department = ? AND subid = ?",
      [deptid, subid]
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
  const { deptid } = req.params;
  const { subName, subCode, component } = req.body;

  if (!subName || !subCode || !component) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const connection = await db.getConnection(); // db = mysql2/promise

  try {
    await connection.beginTransaction();

    const [existingSubject] = await connection.query(
      "SELECT * FROM subjects WHERE subCode = ?",
      [subCode]
    );
    if (existingSubject.length > 0) {
      await connection.release();
      return res.status(400).json({ message: "Subject code already exists" });
    }

    const [subjectResult] = await connection.query(
      "INSERT INTO subjects (subName, subCode, component) VALUES (?,?,?)",
      [subName, subCode, component]
    );

    const [subdeptResult] = await connection.query(
      "INSERT INTO subject_department (subject, department) VALUES (?, ?)",
      [subjectResult.insertId, deptid]
    );

    await connection.commit();
    await connection.release();

    res.status(201).json({
      message: "Subject created and assigned successfully",
      subjectId: subjectResult.insertId,
    });
  } catch (error) {
    await connection.rollback();
    await connection.release();
    console.error("Transaction Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubject = async (req, res) => {
  const { subid, deptid } = req.params;
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
    const [deletedSubDept] = await db.query(
      "DELETE FROM subject_department WHERE subject = ?",
      [subid]
    );
    if (deletedSubDept.length === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }
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
      "SELECT * FROM subjects WHERE subCode = ?",
      [subCode]
    );
    res.status(200).json(subjects[0]);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
