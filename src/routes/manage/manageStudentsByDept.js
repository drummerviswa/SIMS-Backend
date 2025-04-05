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
  getStudentById,
} from "../../controllers/manage/manageStudentsByDept.js";
// /department/manage/student/department/1/2022239013

const router = Router();

router.post("/department/:departmentId", addStudent);
router.get("/department/:departmentId/batch/:batchId", getStudentsByBatch);
router.get("/department/:departmentId/degree/:degreeId", getStudentsByDegree);
router.get("/department/:departmentId/branch/:branchId", getStudentsByBranch);
router.get("/department/:departmentId", getStudentsByDepartment);
router.get("/department/:departmentId/:regNo", getStudentById);
router.put("/department/:departmentId/:regNo", updateStudent);
router.delete("/department/:departmentId/:regNo", deleteStudent);

export default router;
