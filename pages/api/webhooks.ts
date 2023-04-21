import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
// ' micro package ' is a tiny http framework for node.js
import {buffer} from "micro";
// the " buffer " function is used to raw the body of th incoming request
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
    api: {
        bodyParser: false
    }
}


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion:"2022-11-15"
})

const prisma = new PrismaClient();

export default async function handler (req:NextApiRequest, res:NextApiResponse) {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;

    if(!sig) {
        res.status(400).send("No signature found");
        return;
    }
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
    }catch(err) {
        res.status(400).send('Webhook error:' + err);
        return;
    }
    // Handle different types of events
    switch(event?.type) {
        case "payment_intent.created":
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log("PaymentIntent created:", paymentIntent.id);
            break;

        // case "payment_intent.succeeded":
        //     const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
        //     console.log("PaymentIntent succeeded:", paymentIntentSucceeded.id);
        //     break;
       case "charge.succeeded":
            const charge = event.data.object as Stripe.Charge;
            if( typeof charge.payment_intent === "string") {
                const order = await prisma.order.update({
                    where: { paymentIntentID: charge.payment_intent },
                    data: { status: "complete"}
                        
                })
            }
                break
        default:
            console.log(`Unhandled event type ${event.type}`);
        }
        res.status(200).json({received: true});
}

