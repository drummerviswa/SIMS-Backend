import { Router } from "express";
import {
  getMarksByStudent,
  getStudentsCombinedAssessmentMarks,
  getStudentsEntireMarks,
  getStudentsForMarks,
  getStudentsForMarksOther,
  getStudentsForSubject,
  getStudentsMarksByAssessment,
  getStudentsMarksByAssignment,
  getStudentsTotalMarks,
  grantMarks,
  updateMarks,
} from "../../controllers/faculty/marks.js";

const marksRouter = Router({ mergeParams: true });
//Marks viewing

//!View by Assessment
marksRouter.get(
  "/assessment/:faculty/:subject/:tenure/:batch/:degree/:branch",
  getStudentsMarksByAssessment
);
marksRouter.get(
  "/assignment/:faculty/:subject/:tenure/:batch/:degree/:branch",
  getStudentsMarksByAssignment
);

//!View by Subject
marksRouter.get(
  "/combined/:faculty/:subject/:degree/:branch/:batch",
  getStudentsCombinedAssessmentMarks
);
marksRouter.get(
  "/total/:faculty/:subject/:degree/:branch/:batch",
  getStudentsTotalMarks
);

//!View by Students
marksRouter.get("/students/:faculty/:subject", getStudentsForSubject);
marksRouter.get("/student/:faculty/:subject/:regNo", getMarksByStudent);

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

export default marksRouter;
