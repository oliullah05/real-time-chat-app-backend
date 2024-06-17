import express from "express"
import { MessageControllers } from "./message.controller";
import validateRequest from "../../middlewars/validateRequest";
import { MessageValiditons } from "./message.validation";


const router = express.Router();

router.post("/create-message", 
validateRequest(MessageValiditons.createMessage),
MessageControllers.createMessage
);
// router.get("/get-message-By-ConversationId/:conversationId",
// MessageControllers.getMessagesByConversationId
// );


export const MessageRoutes = router;