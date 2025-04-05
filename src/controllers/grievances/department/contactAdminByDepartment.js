import db from "../../../database/db.js";

export const getcontactAdminByDepartment = async (req, res) => {
  const { departmentId } = req.params;
  try {
    const query =
      "SELECT * FROM grievance WHERE reciever=? AND sender=? AND department=?";
    const [rows] = await db.query(query, ["admin", "department", departmentId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No admin found for this department" });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching admin contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createContactAdminByDepartment = async (req, res) => {
  const { department, gMessage } = req.body;
  try {
    const query = `
      INSERT INTO grievance (reciever, sender, department, gMessage) 
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      "admin",
      "department",
      department,
      gMessage,
    ]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Failed to send message" });
    }
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message to admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateContactAdminByDepartment = async (req, res) => {
  const { gid } = req.params;
  const { gMessage } = req.body;
  try {
    const query = `
      UPDATE grievance SET gMessage=? WHERE gid=?
    `;
    const [result] = await db.query(query, [gMessage, gid]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message updated successfully" });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteContactAdminByDepartment = async (req, res) => {
  const { gid } = req.params;
  try {
    const query = `
      DELETE FROM grievance WHERE gid=?
    `;
    const [result] = await db.query(query, [gid]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getContactAdminByDepartmentByGid = async (req, res) => {
  const { gid } = req.params;
  try {
    const query = `
      SELECT * FROM grievance WHERE gid=?
    `;
    const [rows] = await db.query(query, [gid]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No message found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
