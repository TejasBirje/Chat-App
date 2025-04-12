import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json());  // allows us to extract JSON data out from the req.body
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
    connectDB();
})