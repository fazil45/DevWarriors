import express from "express"
const app: express.Express = express()
import userAuth from "./user/routes"

app.use(express.json())

app.use("/api/v1/user",userAuth)


export default app