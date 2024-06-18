import express from "express"
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewars/validateRequest";
import { UserValidations } from "./user.validation";
import auth from "../../middlewars/auth";

const router = express.Router();

router.post("/create-user",
validateRequest(UserValidations.createUser),
UserControllers.createUser)

router.get("/getUsersWithoutMeForMessage",auth("user","admin"),
UserControllers.getUsersWithoutMeForMessage)

router.get("/searchUsersWithoutMeForMessage/:searchTerm",auth("user","admin"),
UserControllers.searchUsersWithoutMeForMessage)



export const UserRoutes = router;