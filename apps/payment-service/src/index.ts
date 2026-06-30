import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { shouldBeUser } from './middleware/authMiddleware.js'

const app = new Hono()

app.use('*', clerkMiddleware())
app.get('/health', (c) => {

  return c.json({
    message: "Payment endpoint is working",
    status: "ok",
    uptime: process.uptime(),
    timeStamp: Date.now()
  })
})
app.get('/test', shouldBeUser, (c) => {

  return c.json({
    message: "Payment service is authenticated.",
    user: c.get('userId')
  })
})

const start = async () => {
  try {
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