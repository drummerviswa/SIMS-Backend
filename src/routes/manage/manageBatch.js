import { Router } from "express";
import {
  createBatch,
  deleteBatch,
  getAllBatch,
  getBatchByBName,
  getBatchById,
  updateBatch,
} from "../../controllers/manage/manageBatch.js";

const router = Router();

router.get("/", getAllBatch);
router.post("/", createBatch);
router.get("/:id", getBatchById);
router.put("/:id", updateBatch);
router.delete("/:id", deleteBatch);
router.get("/batchName/:batchName", getBatchByBName);

export default router;
