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
router.put("/:subid", updateSubject);
router.delete("/:subid", deleteSubject);

export default router;
