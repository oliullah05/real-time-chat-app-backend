import express from "express";
import validateRequest from "../../middlewars/validateRequest";
import { AuthControllers } from "./auth.controller";
import { AuthValidations } from "./auth.validation";
const router = express.Router();

router.post("/login",
validateRequest(AuthValidations.login), 
AuthControllers.login
);
router.post("/refresh-token",
validateRequest(AuthValidations.refreshToken), 
AuthControllers.refreshToken
);

export const AuthRoutes = router;