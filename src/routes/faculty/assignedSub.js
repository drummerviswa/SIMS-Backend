import { Router } from "express";
import {
  getAssignedSub,
  getAssignedSubById,
} from "../../controllers/faculty/assignedSub.js";
import { getSubjectAssignByFacultySubject } from "../../controllers/manage/manageSubjectAssign.js";

const assignedSubRouter = Router({
  mergeParams: true,
});

assignedSubRouter.get("/:facid", getAssignedSub);
assignedSubRouter.get("/sub/:subid", getAssignedSubById);
assignedSubRouter.get(
  "/facSub/:facultyId/:subjectId",
  getSubjectAssignByFacultySubject
);

export default assignedSubRouter;
