import { Router } from "express";
import { viewFaculty } from "../../controllers/views/viewFaculty.js";

const router = Router({ mergeParams: true });

router.get("/",viewFaculty);

export default router;