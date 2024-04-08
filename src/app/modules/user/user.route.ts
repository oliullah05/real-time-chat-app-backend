import express from "express"
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewars/validateRequest";
import { UserValidations } from "./user.validation";

const router = express.Router();

router.post("/create-user",
validateRequest(UserValidations.createUser),
UserControllers.createUser)



export const UserRoutes = router;