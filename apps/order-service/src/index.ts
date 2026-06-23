import fastify from "fastify";

const app = fastify();

app.get("/health", (request, reply) => {
    return reply.status(200).send({
        message: "Order endpoint is working",
        status: "ok",
        uptime: process.uptime(),
        timeStamp: Date.now()
    })
})

const start = async () => {
    try {
        await app.listen({ port: 8001 });
        console.log("Order Service is running on port 8001")
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start();
