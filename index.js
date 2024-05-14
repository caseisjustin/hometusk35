import express from "express"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(express.json())






app.listen(process.env.PORT, err=>{
    err ? console.log("Error running server") :
    console.log("SUCCESS server running on port ", process.env.PORT, "...")                                                                                                                                                                                                                                                                                                       
})