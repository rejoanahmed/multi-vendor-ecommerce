import { z } from 'zod'
import { privateProcedure, publicProcedure, router } from './trpc'
import { TRPCError } from '@trpc/server'
import { getPayloadClient } from '../get-payload'
import { stripe } from '../lib/stripe'
import type Stripe from 'stripe'

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      let { productIds } = input

      if (productIds.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      const payload = await getPayloadClient()
      console.log('payload', payload)
      const { docs: products } = await payload.find({
        collection: 'products',
        where: {
          id: {
            in: productIds
          }
        }
      })
      console.log('products', products)
      const filteredProducts = products.filter((prod) => Boolean(prod.priceId))
      console.log('filteredProducts', filteredProducts)
      const order = await payload.create({
        collection: 'orders',
        data: {
          _isPaid: false,
          products: filteredProducts.map((prod) => prod.id),
          user: user.id
        }
      })

      console.log('order', order)
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

      filteredProducts.forEach((product) => {
        line_items.push({
          price: product.priceId!,
          quantity: 1
        })
      })

      line_items.push({
        price: 'price_1P41JLC66hpWWP4JA5M8hrTu',
        quantity: 1,
        adjustable_quantity: {
          enabled: false
        }
      })

      console.log('line_items', line_items)
      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          mode: 'payment',
          metadata: {
            userId: user.id,
            orderId: order.id
          },
          line_items
        })
        console.log(stripeSession)
        return { url: stripeSession.url }
      } catch (err) {
        console.log(err)
        return { url: null }
      }
    }),
  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input

      const payload = await getPayloadClient()

      const { docs: orders } = await payload.find({
        collection: 'orders',
        where: {
          id: {
            equals: orderId
          }
        }
      })

      if (!orders.length) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const [order] = orders

      return { isPaid: order._isPaid }
    })
})
