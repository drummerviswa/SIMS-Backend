import express from "express";
import facultyAuth from "./fac.auth.js";

const facultyRouter = express.Router();

facultyRouter.use("/auth", facultyAuth);

export default facultyRouter;
