import express from "express"
const app: express.Express = express()
import userRouter from "./user/routes"
import contestRouter from "./contest/routes"
import cookieParser from "cookie-parser"
import cors from "cors"
import { authMiddleware } from "./middleware/auth.middleware"

app.use(cors({
    origin:"http://localhost:3000",
    methods:["GET","POST","PUT","DELETE","OPTIONS","PATCH"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true
}))

app.use(cookieParser())
app.use(express.json())

app.use("/api/v1/user",userRouter)
app.use("/api/v1/contest",authMiddleware,contestRouter)


export default app