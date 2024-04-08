import { ConversationRoutes } from "../modules/conversation/conversation.route";
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
];

allRoutes.map(route=>router.use(route.path,route.route))

export default router;

