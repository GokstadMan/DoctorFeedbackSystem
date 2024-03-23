const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

const port = 7000;

app.use(express.json());

//doctors,CRUD:

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

app.get("/get-doctor/:doctorId", async(req,res)=>{
    const doctorId = parseInt(req.params.doctorId);
    const doctor = await prisma.doctor.findUnique({
      where:{id:doctorId},
      include:{reviews:true}
    })
    res.send(doctor);
})

app.patch("/update-doctor/:doctorId", async(req,res)=>{
    const doctorId = parseInt(req.params.doctorId);
    const doctorData = req.body;
    if(!doctorData.firstname ||
        !doctorData.lastname ||
        !doctorData.city ||
        !doctorData.description) {
        res.send({error:"Please fill in something! Do not leave only blanks.."});
        return;
    }   

    const doctor = await prisma.doctor.update({
       where:{id:doctorId},
       data:{
        firstname:doctorData.firstname,
        lastname:doctorData.lastname,
        city:doctorData.city,
        description:doctorData.description
    }  
    });
    res.send({
        success:"Doctorinfo updated!"
    })
})

app.delete("/delete-doctor/:doctorId", async(req,res)=>{
    const doctorId = parseInt(req.params.doctorId);
    const deletedDoctor = await prisma.doctor.delete({
        where:{id:doctorId}
    })
    res.send({ success: "Following doctorinfo deleted: " + deletedDoctor.lastname})
})

//reviews,CRUD:

app.post("/add-review/:doctorId", async(req,res)=>{
    const doctorId = parseInt(req.params.doctorId);
    const reviewData = req.body;
    if(!reviewData.patientname || !reviewData.text) {
        res.send({error:"Please fill in something! Do not leave only blanks.."});
        return;
    }  
    
    const review = await prisma.review.create({
        data:{
            patientname:reviewData.patientname,
            text:reviewData.text,
            doctor:{
                connect:{
                    id: doctorId
                }
            }
        }
    })

    res.send({success:"Added review!"})
    
})

app.get("/get-review/:reviewId", async(req,res)=>{
    const reviewId = parseInt(req.params.reviewId);
    const review = await prisma.review.findUnique({
        where:{id:reviewId}
    })
    res.send(review);
})

app.patch("/update-review/:reviewId", async(req,res)=>{
    const reviewId = parseInt(req.params.reviewId);
    const reviewData = req.body;
    if(!reviewData.patientname || !reviewData.text) {
        res.send({error:"Please fill in something! Do not leave only blanks.."});
        return;
    }  

    const review = await prisma.review.update({
        where:{id:reviewId},
        data:{
            patientname:reviewData.patientname,
            text:reviewData.text
        }
    })
    res.send({success:"Review updated!"})
})

app.delete("/delete-review/:reviewId", async(req,res)=>{
    const reviewId = parseInt(req.params.reviewId);
    const review = await prisma.review.delete({
        where:{id:reviewId}
    }) 
    res.send({success: "review deleted!"})
})






app.listen(port,()=>{
    console.log("Server running on port:",port)
});