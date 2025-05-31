import { Router } from "express";
import {
  getStudentsEntireMarks,
  getStudentsForMarks,
  getStudentsForMarksOther,
  getStudentsMarksByAssessment,
  grantMarks,
  updateMarks,
} from "../../controllers/faculty/marks.js";

const marksRouter = Router({ mergeParams: true });

marksRouter.get(
  "/:faculty/:subject/:tenure/:batch/:degree/:branch/:msid",
  getStudentsForMarks
);
marksRouter.get(
  "/other/:faculty/:subject/:tenure/:batch/:degree/:branch/:msid",
  getStudentsForMarksOther
);
marksRouter.post(
  "/:faculty/:subject/:tenure/:batch/:degree/:branch/:msid",
  grantMarks
);

marksRouter.put(
  "/:faculty/:subject/:tenure/:batch/:degree/:branch/:msid/update",
  updateMarks
);

marksRouter.get(
  "/:faculty/:subject/:tenure/:batch/:degree/:branch/:msid/entire",
  getStudentsEntireMarks
);

//Marks viewing

//!View by Assessment
marksRouter.get(
  "/:faculty/:subject/:tenure/assessment",
  getStudentsMarksByAssessment
);

export default marksRouter;
