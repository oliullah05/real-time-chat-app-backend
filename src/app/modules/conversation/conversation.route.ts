import express from "express"
import { ConversationControllers } from "./conversation.controller";
import validateRequest from "../../middlewars/validateRequest";
import { ConversationValidations } from "./conversation.validation";
const router = express.Router();

router.post("/create-conversation", 
validateRequest(ConversationValidations.createConversation), 
ConversationControllers.createConversation
);


router.get("/my-conversations", 
ConversationControllers.getMyConversations);

export const ConversationRoutes = router;