import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Successfully Connected to Database: ${conn.connection.host}`)
    } catch (error) {
        console.log("Error connecting to Database ,", error);
    }
}