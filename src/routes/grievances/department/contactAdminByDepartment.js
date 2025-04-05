import { Router } from "express";
import {
  createContactAdminByDepartment,
  deleteContactAdminByDepartment,
  getcontactAdminByDepartment,
  getContactAdminByDepartmentByGid,
  updateContactAdminByDepartment,
} from "../../../controllers/grievances/department/contactAdminByDepartment.js";

const contactAdminByDepartmentRouter = Router();

contactAdminByDepartmentRouter.get(
  "/:departmentId",
  getcontactAdminByDepartment
);
contactAdminByDepartmentRouter.post(
  "/:departmentId",
  createContactAdminByDepartment
);
contactAdminByDepartmentRouter.put(
  "/:departmentId/:gid",
  updateContactAdminByDepartment
);
contactAdminByDepartmentRouter.delete(
  "/:departmentId/:gid",
  deleteContactAdminByDepartment
);
contactAdminByDepartmentRouter.get(
  "/:departmentId/:gid",
  getContactAdminByDepartmentByGid
);

export default contactAdminByDepartmentRouter;
