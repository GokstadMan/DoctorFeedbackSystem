const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();

const port = 7000;







app.listen(port,()=>{
    console.log("Server running on port:",port)
});