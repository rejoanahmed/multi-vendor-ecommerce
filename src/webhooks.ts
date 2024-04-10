import express from 'express'
import { WebhookRequest } from './server'
import { stripe } from './lib/stripe'
import type Stripe from 'stripe'
import { getPayloadClient } from './get-payload'
import { Product } from './payload-types'
import { Resend } from 'resend'
import { ReceiptEmailHtml } from './components/emails/ReceiptEmail'
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

const resend = new Resend('re_4d3jErur_JkpDLi4jdFDicw6LU6DJTq1J')

const client = new MongoClient(process.env.MONGODB_URL!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function decrementStock(products: Product[]) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    // update stock
    for (const product of products) {
      console.log('product:', product.id)
      const res = await client
        .db('3100')
        .collection('products')
        .updateOne(
          {
            _id: new ObjectId(product.id)
          },
          {
            $set: {
              stock: product.stock - 1
            }
          }
        )
      console.log('Stock decremented:', res)
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}

export const stripeWebhookHandler = async (
  req: express.Request,
  res: express.Response
) => {
  const webhookRequest = req as any as WebhookRequest
  const body = webhookRequest.rawBody
  const signature = req.headers['stripe-signature'] || ''

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err) {
    return res
      .status(400)
      .send(
        `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`
      )
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    return res.status(400).send(`Webhook Error: No user present in metadata`)
  }

  if (event.type === 'checkout.session.completed') {
    const payload = await getPayloadClient()

    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: session.metadata.userId
        }
      }
    })

    const [user] = users

    if (!user) return res.status(404).json({ error: 'No such user exists.' })

    const { docs: orders } = await payload.find({
      collection: 'orders',
      depth: 2,
      where: {
        id: {
          equals: session.metadata.orderId
        }
      }
    })

    const [order] = orders

    if (!order) return res.status(404).json({ error: 'No such order exists.' })

    await payload.update({
      collection: 'orders',
      data: {
        _isPaid: true
      },
      where: {
        id: {
          equals: session.metadata.orderId
        }
      }
    })

    // decrement stock for each product

    decrementStock(order.products as Product[])

    // send receipt
    try {
      const data = await resend.emails.send({
        from: 'mutlistore <hello@rejoanahmed.me>',
        to: [user.email],
        subject: 'Thanks for your order! This is your receipt.',
        html: ReceiptEmailHtml({
          date: new Date(),
          email: user.email,
          orderId: session.metadata.orderId,
          products: order.products as Product[]
        })
      })
      res.status(200).json({ data })
    } catch (error) {
      res.status(500).json({ error })
    }
  }

  return res.status(200).send()
}
