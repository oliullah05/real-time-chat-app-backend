import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewars/globalErrorHandler";
import router from "./app/route";
import cookieParser from 'cookie-parser'

const app:Application = express();

// middlewars
app.use(cors())

// parsers
app.use(express.json())
app.use(cookieParser())


// routes
app.use("/api",router)

app.get("/",(req:Request,res:Response)=>{
    res.send("Chat application server is running")
})


app.use(globalErrorHandler);


app.use("*",(req , res)=>{
   res.status(404).json({
    success:false,
    message:"Api Not Found",
    error:{
        path:req.baseUrl,
        message:"Your requested path is not found"
    }

   })
})




export default app;

