import express from "express"
import { ConversationControllers } from "./conversation.controller";
import validateRequest from "../../middlewars/validateRequest";
import { ConversationValidations } from "./conversation.validation";
import auth from "../../middlewars/auth";
const router = express.Router();


router.post("/create-conversation", auth("user","admin"),
validateRequest(ConversationValidations.createConversation), 
ConversationControllers.createConversation);


router.get("/my-conversations", auth("user","admin"),
ConversationControllers.getMyConversations);

router.get("/conversationById/:id", auth("user","admin"),
ConversationControllers.getConversationById);

router.get("/conversationByParticipants", auth("user","admin"),
ConversationControllers.getConversationByParticipants);

router.put("/conversationById/:id", auth("user","admin"),validateRequest(ConversationValidations.updateConversation),
ConversationControllers.updateConversationById);



export const ConversationRoutes = router;