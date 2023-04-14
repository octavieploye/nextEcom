import { authOptions } from '@/pages/api/auth/[...nextauth]';
import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { AddCartType } from '@/type/AddCartType';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion:"2022-11-15"
})
// CALCULATE THE ORDER AMOUNT
//  ACC = ACCUMULATOR
const calculateOrderAmount = (items: AddCartType[]) => {
    const totalPrice =items.reduce((acc, item) => {
        return acc + item.unit_amount! * item.quantity!;
    },0)
    return totalPrice;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // GET THE USER
    const userSession = await getServerSession(req, res, authOptions);
          if(!userSession) {
              res.status(403).json({message: "You are not logged in"})
              return;
          }
    // EXTRAT THE DATA FROM THE BODY
    const {items, payment_intent_id} = req.body;

    // CREATE THE ORDER DATA 

    const orderData = {
        user: {connect: {id: userSession.user?.id}},
        amount: calculateOrderAmount(items),
        currency:"eur",
        // We set the status to pending because we want to create the payment intent first  and then we will update the status to paid
        // Also IT WILL STORE THE ORDER DATA IN THE DATABASE - CAN BE USED FOR ORDER ANALYSIS
        // IT WILL WILL UPDATE THE DATA WHEN THE ORDER IS PAID, FAILED, CANCELLED, REFUNDED, REQUIRE-ACTION...ETC
         status:'pending',
         paymentIntentID: payment_intent_id,
         products: {
            create: items.map((item) => ({
                name: item.name,
                description: item.description,
                unit_amount: item.unit_amount,
                quantity: item.quantity,
            }))
         }

    }

    res.status(200).json({userSession})
    return

}