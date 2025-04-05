import db from "../../../database/db.js";

export const getContactDepartment = async (req, res) => {
  const { facultyId } = req.params;
  try {
    const query =
      "SELECT * FROM grievance WHERE reciever=? AND sender=? AND faculty=?";
    const [rows] = await db.query(query, ["department", "faculty", facultyId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No admin found for this faculty" });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching admin contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createContactDepartment = async (req, res) => {
  const { faculty, gMessage } = req.body;
  try {
    const query = `
        INSERT INTO grievance (reciever, sender, faculty, gMessage) 
        VALUES (?, ?, ?, ?)
        `;
    const [result] = await db.query(query, [
      "department",
      "faculty",
      faculty,
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

export const updateContactDepartment = async (req, res) => {
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

export const deleteContactDepartment = async (req, res) => {
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
export const getContactDepartmentByGid = async (req, res) => {
  const { gid } = req.params;
  try {
    const query = `
        SELECT * FROM grievance WHERE gid=?
      `;
    const [rows] = await db.query(query, [gid]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
