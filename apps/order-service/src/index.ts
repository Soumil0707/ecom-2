import fastify from "fastify";
import { clerkPlugin } from '@clerk/fastify'
import { shouldBeUser } from "./middleware/authMiddleware.js"
import { connectOrderDB } from "@repo/order-db";
import { orderRoute } from "./routes/order.js";
import { producer, consumer } from "./utils/kafka.js";

const app = fastify();
app.register(clerkPlugin)


app.get("/health", (request, reply) => {
    return reply.status(200).send({
        message: "Order endpoint is working",
        status: "ok",
        uptime: process.uptime(),
        timeStamp: Date.now()
    })
})

app.get("/test", { preHandler: shouldBeUser }, (request, reply) => {

    return reply.status(200).send({
        message: "Order service is authenticated",
        status: "ok",
        userId: request.userId
    })
})

app.register(orderRoute)

const start = async () => {
    try {

        await Promise.all([
            connectOrderDB(),
            producer.connect(),
            consumer.connect()
        ])
        await app.listen({ port: 8001 });
        console.log("Order Service is running on port 8001")
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

start();
