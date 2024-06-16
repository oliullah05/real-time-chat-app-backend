import express from "express"
import { ConversationControllers } from "./conversation.controller";
import validateRequest from "../../middlewars/validateRequest";
import { ConversationValidations } from "./conversation.validation";
import auth from "../../middlewars/auth";
const router = express.Router();


router.post("/create-conversation", auth("user","admin"),
validateRequest(ConversationValidations.createConversation), 
ConversationControllers.createConversation);


// router.get("/my-conversations", auth("user","admin"),
// ConversationControllers.getMyConversations);

export const ConversationRoutes = router;