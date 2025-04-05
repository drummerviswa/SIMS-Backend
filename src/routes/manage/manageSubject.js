import { Router } from "express";
import {
  createSubject,
  deleteSubject,
  getAllSubjects,
  getSubjectByDegree,
  getSubjectById,
  updateSubject,
} from "../../controllers/manage/manageSubject.js";

const router = Router();

router.get("/", getAllSubjects);
router.post("/", createSubject);
router.get("/degree/:degree", getSubjectByDegree);
router.get("/:subid", getSubjectById);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

export default router;
