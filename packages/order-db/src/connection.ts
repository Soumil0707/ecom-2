import mongoose from "mongoose";

let isConnected = false;

export const connectOrderDB = async () => {

    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGO_URL!);
        isConnected = true;
        console.log("Order Service DB Connected")
    }
    catch (error) {
        console.log(error);
        throw error;
    }

}