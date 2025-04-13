import { Router } from "express";
import { getAssignedSub, getAssignedSubById } from "../../controllers/faculty/assignedSub.js";

const assignedSubRouter = Router({
    mergeParams: true,
});

assignedSubRouter.get("/:facid", getAssignedSub);
assignedSubRouter.get("/sub/:subid", getAssignedSubById);

export default assignedSubRouter;
