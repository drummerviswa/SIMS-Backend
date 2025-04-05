import { Router } from "express";
import {
  createContactDepartment,
  deleteContactDepartment,
  getContactDepartment,
  getContactDepartmentByGid,
  updateContactDepartment,
} from "../../../controllers/grievances/faculty/contactDepartment.js";

const contactDepartmentRouter = Router();

contactDepartmentRouter.get("/:facultyId", getContactDepartment);
contactDepartmentRouter.get("/:facultyId/:gid", getContactDepartmentByGid);
contactDepartmentRouter.post("/:facultyId", createContactDepartment);
contactDepartmentRouter.put("/:facultyId/:gid", updateContactDepartment);
contactDepartmentRouter.delete("/:facultyId/:gid", deleteContactDepartment);

export default contactDepartmentRouter;
