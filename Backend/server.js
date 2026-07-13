import express from 'express';
import dotenv from "dotenv";
import connectDB from "./config/db.js";


dotenv.config();

connectDB();


const app = express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Server is ready")
})
console.log("MONGO_URI:", process.env.MONGO_URI);
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});