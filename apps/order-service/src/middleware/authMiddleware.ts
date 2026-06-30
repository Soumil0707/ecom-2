import { getAuth } from "@clerk/fastify"
import { FastifyReply, FastifyRequest } from "fastify"
import type { CustomJwtSessionClaims } from "@repo/types"

declare module "fastify" {
    interface FastifyRequest {
        userId?: string
    }
}

export const shouldBeUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { isAuthenticated, userId } = getAuth(request)
    if (!isAuthenticated) {
        return reply.status(401).send({
            message: "Unauthorized"
        })
    }
    request.userId = userId
}

export const shouldBeAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
    const auth = getAuth(request)
    if (!auth.isAuthenticated) {
        return reply.status(401).send({
            message: "Unauthorized"
        })
    }

    const claims = auth.sessionClaims as CustomJwtSessionClaims
    if (claims.metadata?.role !== "admin") {
        return reply.status(403).send({
            message: "Forbidden"
        })
    }
    request.userId = auth.userId
}