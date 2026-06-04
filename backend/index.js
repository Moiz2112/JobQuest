//firstly creating server
//const express = require('express')//old way

import express from "express" //we write "type" : "module" below test in package.json file for using import 
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import adminRoute from "./routes/admin.route.js";
import reportRoute from "./routes/report.route.js";
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
    origin : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177"],
    credentials : true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions));
const PORT = process.env.PORT || 3000;



//api's
app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/application",applicationRoute);
app.use("/api/v1/admin",adminRoute);
app.use("/api/v1/reports", reportRoute);

//these api's are available
// User: http://localhost:3000/api/v1/user/register, /login, /logout, /profile/update
// Company: http://localhost:3000/api/v1/company/register, /get, /get/:id, /update/:id
// Job: http://localhost:3000/api/v1/job/post, /get, /getadminjobs, /get/:id
// Application: http://localhost:3000/api/v1/application/apply/:id, /get, /:id/applicants, /status/:id/update


app.listen(PORT , ()=>{//here we have to pass two things - port number and call back
    connectDB();
    console.log(`Server running at port : ${PORT}`)
}) 



