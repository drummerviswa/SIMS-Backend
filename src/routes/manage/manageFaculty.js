import { Router } from "express";

import {
  createFaculty,
  deleteFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
} from "../../controllers/manage/manageFaculty.js";

const router = Router();

router.get("/", getAllFaculty);
router.post("/", createFaculty);
router.put("/:id", updateFaculty);
router.delete("/:id", deleteFaculty);
router.get("/:id", getFacultyById);

export default router;
