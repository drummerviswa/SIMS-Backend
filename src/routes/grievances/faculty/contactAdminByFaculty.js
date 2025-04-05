import { Router } from "express";

const contactAdminByFacultyRouter = Router();
import {
  createContactAdminByFaculty,
  deleteContactAdminByFaculty,
  getContactAdminByFaculty,
  getContactAdminByFacultyByGid,
  updateContactAdminByFaculty,
} from "../../../controllers/grievances/faculty/contactAdminByFaculty.js";

contactAdminByFacultyRouter.get("/:facultyId", getContactAdminByFaculty);
contactAdminByFacultyRouter.get(
  "/:facultyId/:gid",
  getContactAdminByFacultyByGid
);
contactAdminByFacultyRouter.post("/:facultyId", createContactAdminByFaculty);
contactAdminByFacultyRouter.put(
  "/:facultyId/:gid",
  updateContactAdminByFaculty
);
contactAdminByFacultyRouter.delete(
  "/:facultyId/:gid",
  deleteContactAdminByFaculty
);

export default contactAdminByFacultyRouter;
