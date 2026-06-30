import mongoose, { InferSchemaType, model } from 'mongoose';
const { Schema } = mongoose;


const OrderSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    products: [
        {
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["failed", "success"]
    },
    shippingAddress: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

export type OrderSchemaType = InferSchemaType<typeof OrderSchema>;
export const Order = model<OrderSchemaType>("Order", OrderSchema);