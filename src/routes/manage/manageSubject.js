import { Router } from "express";
import {
  createSubject,
  deleteSubject,
  getAllSubjects,
  getSubjectByDegree,
  getSubjectById,
  getSubjectBySubCode,
  updateSubject,
} from "../../controllers/manage/manageSubject.js";

const router = Router();

router.get("/", getAllSubjects);
router.post("/", createSubject);
router.get("/degree/:degree", getSubjectByDegree);
router.get("/:subid", getSubjectById);
router.put("/:subid", updateSubject);
router.delete("/:subid", deleteSubject);
router.get("/subCode/:subCode", getSubjectBySubCode);

export default router;
