const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

const port = 7000;

app.use(express.json());

app.post("/add-doctor", async(req,res)=>{
    const doctorData = req.body;
    if(!doctorData.firstname ||
        !doctorData.lastname ||
        !doctorData.city ||
        !doctorData.description) {
        res.send({error:"Please fill in something! Do not leave only blanks.."});
        return;
    }   

    const doctor = await prisma.doctor.create({
        data:{
            firstname:doctorData.firstname,
            lastname:doctorData.lastname,
            city:doctorData.city,
            description:doctorData.description
        }
    })
    res.send({success:"Doctor now successfully in the documentsystem!"})
})

app.get("/get-doctors", async(req,res)=>{
    const doctors = await prisma.doctor.findMany({
       include:{reviews:true} 
    })
    res.send(doctors)
});







app.listen(port,()=>{
    console.log("Server running on port:",port)
});