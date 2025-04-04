import db from "../../database/db.js";
//	batchid	batchName

export const getAllBatch = async (req, res) => {
  try {
    const [batches] = await db.query("SELECT * FROM batch");
    res.status(200).json(batches);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createBatch = async (req, res) => {
  const { batchName } = req.body;
  try {
    const [newBatch] = await db.query(
      "INSERT INTO batch (batchName) VALUES (?)",
      [batchName]
    );
    res.status(201).json(newBatch);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBatchById = async (req, res) => {
  const { id } = req.params;
  try {
    const [batch] = await db.query("SELECT * FROM batch WHERE batchid = ?", [
      id,
    ]);
    if (batch.length === 0) {
      return res.status(404).json({ error: "Batch not found" });
    }
    res.status(200).json(batch[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateBatch = async (req, res) => {
  const { id } = req.params;
  const { batchName } = req.body;
  try {
    const [updatedBatch] = await db.query(
      "UPDATE batch SET batchName = ? WHERE batchid = ?",
      [batchName, id]
    );
    if (updatedBatch.length === 0) {
      return res.status(404).json({ error: "Batch not found" });
    }
    res.status(200).json(updatedBatch[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteBatch = async (req, res) => {
  const { id } = req.params;
  try {
    const [deletedBatch] = await db.query(
      "DELETE FROM batch WHERE batchid = ?",
      [id]
    );
    if (deletedBatch.length === 0) {
      return res.status(404).json({ error: "Batch not found" });
    }
    res.status(200).json(deletedBatch[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
