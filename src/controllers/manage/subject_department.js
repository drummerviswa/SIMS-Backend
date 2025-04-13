import db from "../../database/db.js";

//id	subject	department

export const getAllSubjectDepartments = async (req, res) => {
  try {
    const [subjectDepartments] = await db.query(
      "SELECT sd.*,s.*,d.* FROM subject_department AS sd JOIN subjects AS s ON sd.subject = s.subid JOIN department AS d ON sd.department = d.deptid"
    );
    res.status(200).json(subjectDepartments);
  } catch (error) {
    console.error("Error fetching subject departments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubjectDepartmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [subjectDepartment] = await db.query(
      "SELECT * FROM subject_department WHERE id = ?",
      [id]
    );
    if (subjectDepartment.length === 0) {
      return res.status(404).json({ message: "Subject department not found" });
    }
    res.status(200).json(subjectDepartment[0]);
  } catch (error) {
    console.error("Error fetching subject department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createSubjectDepartment = async (req, res) => {
  const { subject, department } = req.body;
  try {
    const [newSubjectDepartment] = await db.query(
      "INSERT INTO subject_department (subject, department) VALUES (?, ?)",
      [subject, department]
    );
    res.status(201).json(newSubjectDepartment);
  } catch (error) {
    console.error("Error creating subject department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubjectDepartment = async (req, res) => {
  const { id } = req.params;
  const { subject, department } = req.body;
  try {
    const [updatedSubjectDepartment] = await db.query(
      "UPDATE subject_department SET subject = ?, department = ? WHERE id = ?",
      [subject, department, id]
    );
    if (updatedSubjectDepartment.affectedRows === 0) {
      return res.status(404).json({ message: "Subject department not found" });
    }
    res.status(200).json(updatedSubjectDepartment);
  } catch (error) {
    console.error("Error updating subject department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSubjectDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const [deletedSubjectDepartment] = await db.query(
      "DELETE FROM subject_department WHERE id = ?",
      [id]
    );
    if (deletedSubjectDepartment.affectedRows === 0) {
      return res.status(404).json({ message: "Subject department not found" });
    }
    res
      .status(200)
      .json({ message: "Subject department deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
