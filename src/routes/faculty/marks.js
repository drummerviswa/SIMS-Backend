import { Router } from "express";
import {
  getStudentsForMarks,
  grantMarks,
  updateMarks,
} from "../../controllers/faculty/marks.js";

const marksRouter = Router({ mergeParams: true });

marksRouter.get(
  "/:faculty/:subject/:tenure/:batch/:degree/:branch/:msid",
  getStudentsForMarks
);
marksRouter.post(
  "/:faculty/:subject/:tenure/:batch/:degree/:branch/:msid",
  grantMarks
);

marksRouter.put(
  "/:faculty/:subject/:tenure/:batch/:degree/:branch/:msid/update",
  updateMarks
);
export default marksRouter;
