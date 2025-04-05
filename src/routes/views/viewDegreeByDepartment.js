import { Router } from "express";
import { viewDegreeByDepartment } from "../../controllers/views/viewDegree.js";

const router = Router({ mergeParams: true });

router.get("/", viewDegreeByDepartment);

export default router;
