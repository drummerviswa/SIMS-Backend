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
router.get("/:id", getSubjectById);
router.post("/", createSubject);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);
router.get("/degree/:degree", getSubjectByDegree);

export default router;
