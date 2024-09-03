import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewars/globalErrorHandler";
import router from "./app/route";
import cookieParser from 'cookie-parser'
import { createServer } from "http";
import { Server } from "socket.io";

const app: Application = express();

const server = createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"], // Specify allowed methods if needed
        credentials: true
    }
})
let activeUsers: { userId: string, socketId: string, userInfo: { id: string } }[] = []


io.on("connection", (socket) => {



    // console.log("user connected", socket.id)


    socket.on("setActiveUsers", (user) => {
        const checkUser = activeUsers.some(u => u.userId === user.userId);
        if (!checkUser) {
            activeUsers.push(user);
            console.log(activeUsers);
            io.emit("seeActiveUsers", activeUsers)
        }
    })
});




// middlewars
app.use(cors())

// parsers
app.use(express.json())
app.use(cookieParser())


// routes
app.use("/api", router)

app.get("/", (req: Request, res: Response) => {
    res.send("Chat application server is running")
})


app.use(globalErrorHandler);


app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Api Not Found",
        error: {
            path: req.baseUrl,
            message: "Your requested path is not found"
        }

    })
})




export default server;

