import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/health', (c) => {
  return c.json({
    message: "Payment endpoint is working",
    status: "ok",
    uptime: process.uptime(),
    timeStamp: Date.now()
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