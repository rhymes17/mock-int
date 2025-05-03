import mongoose from "mongoose";

const connectDb = async () => {
    try {
        console.log({mongo: process.env.MONGO_URI})
        const conn = await mongoose.connect(process.env.MONGO_URI!);
        console.log(`Database connected successfully ${conn.connection.host}`)
    } catch (error) {
        console.log("Error occured in database connection", error);
    }
}

export default connectDb