import { createMiddleware } from "hono/factory";
import { getAuth } from "@hono/clerk-auth";
import { CustomJwtSessionClaims } from "@repo/types";

export const shouldBeUser = createMiddleware<{
    Variables: {
        userId: string;
    }
}>(async (c, next) => {
    const auth = getAuth(c)

    if (!auth?.userId) {
        return c.json({
            message: "Unauthorized"
        }, 401)
    }

    c.set('userId', auth.userId)
    await next()
})
export const shouldBeAdmin = createMiddleware<{
    Variables: {
        userId: string;
    }
}>(async (c, next) => {
    const auth = getAuth(c)

    if (!auth?.userId) {
        return c.json({
            message: "Unauthorized"
        }, 401)
    }
    const claims = auth.sessionClaims as CustomJwtSessionClaims
    if (claims.metadata?.role !== "admin") {
        return c.json({
            message: "Forbidden"
        }, 403)
    }
    c.set('userId', auth.userId)
    await next()
})