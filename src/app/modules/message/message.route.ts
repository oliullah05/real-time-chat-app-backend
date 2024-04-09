import express from "express"
import { MessageControllers } from "./message.controller";


const router = express.Router();

router.post("/create-message", 

MessageControllers.createMessage
);


export const MessageRoutes = router;