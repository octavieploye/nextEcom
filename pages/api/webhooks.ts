import Stripe from "stripe";
import { prisma } from "@/Utility/prisma"
// ' micro package ' is a tiny http framework for node.js
import {buffer} from "micro";
// the " buffer " function is used to raw the body of th incoming request
import { NextApiRequest, NextApiResponse } from "next";

// Stripe webhooks doc
export const config = {
    api: {
        bodyParser: false
    }
}

// Access Stripe API
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion:"2022-11-15"
})

export default async function handler (req:NextApiRequest, res:NextApiResponse) {
    const buf = await buffer(req);
    // Stripe will be giving a signature to verify the event
    const sig = req.headers["stripe-signature"]

    if(!sig) {
        res.status(400).send("No signature found");
        return;
    }
    // Construct the event
    let event: Stripe.Event;

//Handle different types of events


    try {
        event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    }catch(err) {
        console.error(err);
            res.status(400).send('Webhook error:' + err);
            return;     
    }
    // Handle different types of events
    switch(event.type) {
        case "payment_intent.created":
            const paymentIntent = event.data.object
            console.log("PaymentIntent created:");
            break;

        // confirm that a payment has been successfully processed and the funds have been transferred to the merchant's account.
       case "charge.succeeded":
            const charge = event.data.object as Stripe.Charge;
            if( typeof charge.payment_intent === "string") {
                const order = await prisma.order.update({
                    where: { paymentIntentID: charge.payment_intent },
                    // update the db order status from 'pending' to 'complete'
                    data: { status: "complete"},   
                })
                console.log(`Order ${order.id} updated successfully`)
            
            }
                break
        default:
            console.log(`Unhandled event type ${event.type}`);
        }
        res.status(200).send('OK')
}