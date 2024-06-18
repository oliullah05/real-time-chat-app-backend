import express from "express"
import { MessageControllers } from "./message.controller";
import validateRequest from "../../middlewars/validateRequest";
import { MessageValiditons } from "./message.validation";
import auth from "../../middlewars/auth";


const router = express.Router();

router.post("/create-message", auth("user","admin"),
validateRequest(MessageValiditons.createMessage),
MessageControllers.createMessage
);

router.get("/conversationId/:conversationId",auth("user","admin"),
MessageControllers.getMessagesByConversationId
);



export const MessageRoutes = router;