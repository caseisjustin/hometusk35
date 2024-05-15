import express, { Router } from "express"
import router from "./routes/users.router.js"
import dotenv from "dotenv"

dotenv.config()

const app = express()


app.use(express.json())

app.use("/api", router)


app.listen(process.env.PORT, err=>{
    if(err){
        console.log("An error occured connecting to server on port", process.env.PORT)
    }
    else{
        console.log("Connected to server on port ", process.env.PORT, ".....")
    }
})