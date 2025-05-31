import { Router } from "express";
import {
  addAssignmentSplitup,
  deleteAssignmentSplitup,
  getAssignmentSplitup,
  updateAssignmentSplitup,
} from "../../controllers/faculty/assignmentSplitup.js";

const assignmentSplitupRouter = Router({ mergeParams: true });

assignmentSplitupRouter.get("/:faculty/:subject", getAssignmentSplitup);
assignmentSplitupRouter.post("/:faculty/:subject", addAssignmentSplitup);
assignmentSplitupRouter.put("/:faculty/:subject/:id", updateAssignmentSplitup);
assignmentSplitupRouter.delete("/:faculty/:subject/:id", deleteAssignmentSplitup);

export default assignmentSplitupRouter;
