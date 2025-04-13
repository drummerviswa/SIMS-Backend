import { Router } from "express";
import {
  createSubject,
  deleteSubject,
  getAllSubjects,
  getSubjectByDegree,
  getSubjectById,
  getSubjectBySubCode,
  updateSubject,
} from "../../controllers/manage/manageSubjectDepartment.js";

const router = Router();

router.get("/:deptid", getAllSubjects);
router.post("/:deptid", createSubject);
router.get("/:deptid/degree/:degree", getSubjectByDegree);
router.get("/:deptid/:subid", getSubjectById);
router.put("/:deptid/:subid", updateSubject);
router.delete("/:deptid/:subid", deleteSubject);
router.get("/:deptid/subCode/:subCode", getSubjectBySubCode);

export default router;
