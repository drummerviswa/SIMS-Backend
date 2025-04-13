import { Router } from "express";
import {
  createSubjectDepartment,
  deleteSubjectDepartment,
  getAllSubjectDepartments,
  getSubjectDepartmentById,
  updateSubjectDepartment,
} from "../../controllers/manage/subject_department.js";

const subjectDepartmentRouter = Router();

subjectDepartmentRouter.get("/", getAllSubjectDepartments);
subjectDepartmentRouter.get("/:id", getSubjectDepartmentById);
subjectDepartmentRouter.post("/", createSubjectDepartment);
subjectDepartmentRouter.put("/:id", updateSubjectDepartment);
subjectDepartmentRouter.delete("/:id", deleteSubjectDepartment);

export default subjectDepartmentRouter;