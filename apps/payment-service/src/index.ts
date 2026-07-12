import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware } from '@hono/clerk-auth'
import sessionRoute from './route/session.route.js'
import { cors } from 'hono/cors'
import webhookRoute from './route/webhooks.route.js'
import { consumer, producer } from './utils/kafka.js'

const app = new Hono()

app.use("*", cors({
  origin: "http://localhost:3002"
}))

app.use('*', clerkMiddleware())
app.get('/health', (c) => {

  return c.json({
    message: "Payment endpoint is working",
    status: "ok",
    uptime: process.uptime(),
    timeStamp: Date.now()
  })
})

app.route("/sessions", sessionRoute)
app.route("/webhooks", webhookRoute)
// app.post('/create-stripe-product', async (c) => {
//   const res = await stripe.products.create({
//     id: "123",
//     name: "testproduct",
//     default_price_data: {
//       currency: "usd",
//       unit_amount: 69 * 100
//     }
//   })
//   return c.json(res)
// })
// app.get('/stripe-product-price', async (c) => {
//   const res = await stripe.prices.list({
//     product: "123"
//   })
//   return c.json(res)
// })

const start = async () => {
  try {
    Promise.all([
      await producer.connect(),
      await consumer.connect()
    ])
    serve({
      fetch: app.fetch,
      port: 8002
    }, (info) => {
      console.log(`Payment service is running on port ${info.port}`)
    })

  }
  catch (err) {
    console.log(err)
    process.exit(1)
  }
}

start()