import { Router } from "express";
import { viewSubjectByFaculty } from "../../controllers/views/viewSubject.js";

const router = Router({ mergeParams: true });

router.get("/",viewSubjectByFaculty);

export default router;