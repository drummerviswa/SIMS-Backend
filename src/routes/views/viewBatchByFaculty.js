import { Router } from "express";
import { viewBatchByFaculty } from "../../controllers/views/viewBatch.js";

const router = Router({ mergeParams: true });

router.get("/",viewBatchByFaculty);

export default router;
