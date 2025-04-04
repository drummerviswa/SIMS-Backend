import { Router } from "express";
import {
  createBranch,
  deleteBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
} from "../../controllers/manage/manageBranch.js";

const router = Router();

router.get("/", getAllBranches);
router.get("/:id", getBranchById);
router.post("/", createBranch);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);

export default router;
