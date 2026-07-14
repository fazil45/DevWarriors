import express from "express"
const app: express.Express = express()
import userAuth from "./user/routes"
import { requestLimiter } from "./config/rate-limit"
import cookieParser from "cookie-parser"
import cors from "cors"

app.use(cors({
    origin:"http://localhost:3000",
    methods:["GET","POST","PUT","DELETE","OPTIONS","PATCH"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true
}))

app.use(cookieParser())
app.use(express.json())
app.use(requestLimiter)
app.use("/api/v1/user",userAuth)


export default app