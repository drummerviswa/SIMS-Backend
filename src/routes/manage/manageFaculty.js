import { Router } from "express";

import {
  createFaculty,
  deleteFaculty,
  getAllFaculty,
  getAllFacultyByDepartment,
  getFacultyById,
  updateFaculty,
} from "../../controllers/manage/manageFaculty.js";

const router = Router();

router.get("/", getAllFaculty);
router.get("/department/:department", getAllFacultyByDepartment);
router.post("/", createFaculty);
router.put("/:id", updateFaculty);
router.delete("/:id", deleteFaculty);
router.get("/:id", getFacultyById);

export default router;
