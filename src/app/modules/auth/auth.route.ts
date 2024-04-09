import validateRequest from "../../middlewars/validateRequest";
import express from "express"
import { AuthControllers } from "./auth.controller";
import { AuthValidations } from "./auth.validation";
const router = express.Router();

router.post("/login", 
validateRequest(AuthValidations.login), 
AuthControllers.login
);

export const AuthRoutes = router;