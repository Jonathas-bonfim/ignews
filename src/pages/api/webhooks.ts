import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import { stripe } from '../../services/stripe'
import Stripe from "stripe";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    );
  }
  return Buffer.concat(chunks);
}

const relevantEvents = new Set([
  'checkout.session.completed',
])

export const config = {
  api: {
    bodyParser: false,
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const secret = req.headers['stripe-signature'];

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      return res.status(400).send(`WebHook error: S${error.message}`);
    }

    const { type } = event;
    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case 'checkout.session.completed':
            
            break
          default:
            throw new Error('Unhandled event.')
        }
      } catch (error) {
        return res.json({ error: 'Webhook handler failed.' })
      }
    }
    res.status(200).json({ received: true });
  } else {
    res.setHeader('allow', 'POST');
    res.status(405).end('Method not allowed');
  }
}