const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const markerRoute = require("./routes/marker");
const usersRoute = require("./routes/users");

const app = express();
dotenv.config();

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


app.use("/api/marker", markerRoute);
app.use("/api/users", usersRoute);

app.listen(8800,()=>{
    console.log("Backend server is running")
})
