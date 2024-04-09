import { AuthRoutes } from "../modules/auth/auth.route";
import { ConversationRoutes } from "../modules/conversation/conversation.route";
import { MessageRoutes } from "../modules/message/message.route";
import { UserRoutes } from "../modules/user/user.route";
import express from "express";
const router = express.Router()

const allRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/conversation",
    route: ConversationRoutes,
  },
  {
    path: "/message",
    route: MessageRoutes
  },
  {
    path: "/auth",
    route: AuthRoutes
  },
];

allRoutes.map(route=>router.use(route.path,route.route))

export default router;

