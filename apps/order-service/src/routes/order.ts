import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { shouldBeUser, shouldBeAdmin } from "../middleware/authMiddleware";
import { Order } from "@repo/order-db";


export const orderRoute = async (fastify: FastifyInstance) => {

    fastify.get("/user-orders", { preHandler: shouldBeUser }, async (request: FastifyRequest, reply: FastifyReply) => {
        const order = await Order.find({ userId: request.userId });
        return reply.send({
            order
        });
    })
    fastify.get("/orders", { preHandler: shouldBeAdmin }, async (request: FastifyRequest, reply: FastifyReply) => {
        const order = await Order.find();
        return reply.send({
            order
        });
    })
}