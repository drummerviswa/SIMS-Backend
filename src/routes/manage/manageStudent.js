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
router.get("/:regNo", getAllStudents);
router.post("/", addStudent);
router.put("/:regNo", updateStudent);
router.delete("/:regNo", deleteStudent);
router.get("/batch/:batchId", getStudentsByBatch);
router.get("/degree/:degreeId", getStudentsByDegree);
router.get("/branch/:branchId", getStudentsByBranch);
router.get("/department/:departmentId", getStudentsByDepartment);

export default router;
