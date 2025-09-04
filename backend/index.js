//firstly creating server
//const express = require('express')//old way

import express from "express" //we write "type" : "module" below test in package.json file for using import 
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
dotenv.config();

const app = express();

//demo api making


/*
app.get("/home",(req,res)=>{
    return res.status(200).json({
        message : "I am web developer",
        success : true
    })
})
    */



//middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
const corsOptions = {
    origin : "http://localhost:5173",
    credentials : true,
}

app.use(cors(corsOptions));
const PORT = process.env.PORT || 3000;



//api's
app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);

//these three api are there
// "http://localhost:8000/api/v1/user/register"
// "http://localhost:8000/api/v1/user/login"
// "http://localhost:8000/api/v1/user/profile/update"


app.listen(PORT , ()=>{//here we have to pass two things - port number and call back
    connectDB();
    console.log(`Server running at port : ${PORT}`)
}) 



