import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "stream/consumers";
import Stripe from "stripe";
import { stripe } from "~/lib/stripe";
import { api } from "~/trpc/react";

export const config = {
  api: {
    bodyParser: false,
  },
};

const webHookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const stripeWebHookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webHookSecret);
    } catch (error: any) {
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    //Handle event
    switch (event.type) {
      case "payment_intent.succeeded":
        // const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment Intent was successful! `);
        //hadnle the successful payment
        break;
      case "checkout.session.completed":
        // const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment Intent was successful! `);
        //hadnle the successful payment
        break;
      //...handle other event type
      default:
        console.log(`Unhandle event type ${event.type}`);
    }
    res.status(200).json({ received: true });
  } else {
    res.status(405).end("Method Not Allowed");
  }
};
export default stripeWebHookHandler;
