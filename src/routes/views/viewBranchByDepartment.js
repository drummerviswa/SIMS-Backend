import { Router } from "express";
import { viewBranchByDepartment } from "../../controllers/views/viewBranch.js";

const router = Router({ mergeParams: true });

router.get("/", viewBranchByDepartment);

export default router;
