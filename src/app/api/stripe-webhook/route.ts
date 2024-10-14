import { error } from "console";
import { NextApiRequest } from "next";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";



/**
 
 * @param request
 * @returns
 */

export const POST = async (req: NextRequest) => {
  /*************************This method use non siganture method due to next api raw body parser problem******************************************/
  // console.log("webhook event occured");
  if (req.method !== "POST") {
    return NextResponse.json(
      {
        error: "Bad Request! Only POST method is allowed",
      },
      {
        status: 400,
      },
    );
  }
  // console.log("webhook event handling start");

  const signature = req.headers.get("stripe-signature");
  const data = await req.json();
  // console.log("data", data);
  // console.log("signature", signature);
  // let event: Stripe.Event;
  // const secret = process.env.STRIPE_WEBHOOK_SECRET! || "";
  // console.log("webhook secret is:", secret);
  // try {
  //   event = stripe.webhooks.constructEvent(body, signature, secret);
  // } catch (error) {
  //   console.log("Error!!!!!!!!!!: stripe signing fail");
  //   console.log(error);
  //   return new NextResponse("invalid signature", { status: 400 });
  // }

  // const session = event.data.object as Stripe.Checkout.Session;
  // console.log("session", session);
  switch (data.type) {
    case "payment_intent.succeeded":
      console.log("payment succeeded");
      // io.emit("stripeWebHookEvent", "payment succedded");
      //TODO:implement payment handling here
      break;
    case "checkout.session.completed":
      console.log("payment successful for session");
      // io.emit("stripeWebHookEvent", "payment complete for session");
      //TODO:implement payment handling here
      break;
    // ... handle other event types
    default:
    //console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse("ok", { status: 200 });
};
