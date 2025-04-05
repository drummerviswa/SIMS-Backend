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
router.post("/", createBranch);
router.get("/:id", getBranchById);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);

export default router;
