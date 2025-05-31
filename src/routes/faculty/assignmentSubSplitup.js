import { Router } from "express";
import {
  addAssignmentSubsplitup,
  deleteAssignmentSubsplitup,
  getAssignmentSubsplitup,
  getSubSplitAssignByTenure,
  updateAssignmentSubsplitup,
} from "../../controllers/faculty/assignmentSubSplitup.js";

const assignmentSubSubSplitupRouter = Router();

assignmentSubSubSplitupRouter.get(
  "/:faculty/:subject/:asid",
  getAssignmentSubsplitup
);
assignmentSubSubSplitupRouter.post(
  "/:faculty/:subject",
  addAssignmentSubsplitup
);
assignmentSubSubSplitupRouter.put(
  "/:faculty/:subject/:id",
  updateAssignmentSubsplitup
);
assignmentSubSubSplitupRouter.delete(
  "/:faculty/:subject/:id",
  deleteAssignmentSubsplitup
);
assignmentSubSubSplitupRouter.get(
  "/ten/:faculty/:subject/:tenure",
  getSubSplitAssignByTenure
);

export default assignmentSubSubSplitupRouter;
