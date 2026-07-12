import { Hono } from "hono";
import stripe from "../utils/stripe";
import { shouldBeUser } from "../middleware/authMiddleware";
import { CartItemsType } from "@repo/types";
import { getStripeProductPrice } from "../utils/stripeProduct";

const sessionRoute = new Hono()

sessionRoute.post('/create-checkout-session', shouldBeUser, async (c) => {
    const { cart }: { cart: CartItemsType } = await c.req.json()
    const userId = c.get("userId")

    const lineItems = await Promise.all(
        cart.map(async (item) => {
            const unitAmount = await getStripeProductPrice(item.id)
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: unitAmount || 0 as number,
                },
                quantity: item.quantity,
            }
        })
    )
    try {
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'elements',
            client_reference_id: userId,
            line_items: lineItems as any,
            mode: 'payment',
            return_url: 'http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}',
        });
        return c.json({ checkoutSessionClientSecret: session.client_secret })
    } catch (error) {
        console.log(error)
        return c.json({ error: "Error creating checkout session" }, 500)
    }
})
sessionRoute.get('/:session_id', async (c) => {
    const session = await stripe.checkout.sessions.retrieve(c.req.param('session_id'), {
        expand: ["line_items"]
    });
    console.log(session)
    return c.json({ status: session.status, paymentStatus: session.payment_status })
})
export default sessionRoute;