import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2026-03-25.dahlia" as any,
    appInfo: {
        name: "Ecom",
        version: "0.1.0"
    }
});

export default stripe;