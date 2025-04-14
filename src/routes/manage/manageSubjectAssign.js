import { Router } from "express";
import {
  createSubjectAssign,
  deleteSubjectAssign,
  getSubjectAssignByDepartment,
  getSubjectAssignByFaculty,
  getSubjectAssignByFacultySubject,
  getSubjectAssignById,
  updateSubjectAssign,
} from "../../controllers/manage/manageSubjectAssign.js";

const subjectAssignRouter = Router();

subjectAssignRouter.get("/:departmentId", getSubjectAssignByDepartment);
subjectAssignRouter.get(
  "/:departmentId/faculty/:facultyId",
  getSubjectAssignByFaculty
);
subjectAssignRouter.post("/:departmentId", createSubjectAssign);
subjectAssignRouter.put("/:departmentId", updateSubjectAssign);
subjectAssignRouter.delete("/:departmentId", deleteSubjectAssign);
subjectAssignRouter.get("/:departmentId/:assignId", getSubjectAssignById);
subjectAssignRouter.get(
  "/facSub/:facultyId/:subjectId",
  getSubjectAssignByFacultySubject
);

export default subjectAssignRouter;
