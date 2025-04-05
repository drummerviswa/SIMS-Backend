import { Router } from "express";
import {
  addStudent,
  deleteStudent,
  getAllStudents,
  updateStudent,
  getStudentsByBatch,
  getStudentsByDegree,
  getStudentsByBranch,
  getStudentsByDepartment,
} from "../../controllers/manage/manageStudent.js";

const router = Router();

router.get("/", getAllStudents);
router.post("/", addStudent);
router.get("/batch/:batchId", getStudentsByBatch);
router.get("/degree/:degreeId", getStudentsByDegree);
router.get("/branch/:branchId", getStudentsByBranch);
router.get("/department/:departmentId", getStudentsByDepartment);
router.get("/:regNo", getAllStudents);
router.put("/:regNo", updateStudent);
router.delete("/:regNo", deleteStudent);

export default router;
