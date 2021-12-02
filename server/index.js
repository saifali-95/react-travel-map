const express = require("express")
const mongoose = require("mongoose")
const dotevn = require("dotenv")

const app = express();
dotevn.config();

app.use(express.json())

mongoose
    .connect(`${process.env.MONGO_URL}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB Connected!")
    })
    .catch((error) => console.log(error));

app.listen(8800,()=>{
    console.log("Backend server is running")
})