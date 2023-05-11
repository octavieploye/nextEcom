import { authOptions} from "./auth/[...nextauth]"
import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { AddCartType } from '@/type/AddCartType';
import { prisma } from "@/Utility/prisma"

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
    // GET THE USER - Check if the user is logged in - If not return to the loggin page
    const userSession = await getServerSession(req, res, authOptions);
          if(!userSession) {
              res.status(403).json({message: "You are not logged in"})
              return;
          }
    // EXTRAT THE DATA FROM THE BODY
    /**
     * 1. Get the items from the body
     * 2. Get the payment intent id from the body
     * 3. Create the order data
     * 4. items = items that are currently in our cart in our frontend code
     * 5. payment_intent_id = empty pairs of Strings initially
     */
    const {items, payment_intent_id} = req.body;
    console.log(items, payment_intent_id)

    // CREATE THE ORDER DATA 

    const orderData = {
        user: {connect: {id: userSession.user?.id}},
        amount: calculateOrderAmount(items),
        currency:"eur",

        /** // We set the status to pending because we want to create the payment intent first  
         * and then we will update the status to paid
        * Also IT WILL STORE THE ORDER DATA IN THE DATABASE - CAN BE USED FOR ORDER ANALYSIS
        * IT WILL UPDATE THE DATA WHEN THE ORDER IS PAID, FAILED, CANCELLED, REFUNDED, REQUIRE-ACTION...ETC
        */
         status:'pending',
         paymentIntentID: payment_intent_id,
         products: {
            create: items.map((item) => ({
                name: item.name,
                description: item.description || null,
                // parseFloat to make sure it is not converted to a string
                unit_amount:  parseFloat(item.unit_amount),
                image: item.image,
                quantity: item.quantity,
            }))
         }

    }

    // CHECK IF THE PAYMENT INTENT EXISTS 
    /**
     * 1. Initially the payment_intent_id is empty until the user clicks on the checkout button
     * 2. If the payment_intent_id is empty - we go directly to the ELSE statement to create a new order
     */


            //Check if the payment intent exists just update the order
            if (payment_intent_id) {
                const current_intent = await stripe.paymentIntents.retrieve(
                payment_intent_id
                )
                if (current_intent) {
                const updated_intent = await stripe.paymentIntents.update(
                    payment_intent_id,
                    { amount: calculateOrderAmount(items) }
                )
                //Fetch order with product ids
                const [existing_order, updated_order] = await Promise.all([
                    prisma.order.findFirst({
                    where: { paymentIntentID: updated_intent.id },
                    include: { products: true },
                    }),
                    prisma.order.update({
                    where: { paymentIntentID: updated_intent.id },
                    data: {
                        amount: calculateOrderAmount(items),
                        products: {
                        deleteMany: {},
                        create: items.map((item) => ({
                            name: item.name,
                            description: item.description || null,
                            unit_amount: parseFloat(item.unit_amount),
                            image: item.image,
                            quantity: item.quantity,
              })),
            },
          },
        }),
      ])

            if (!existing_order) {
                res.status(400).json({ message: "Invalid Payment Intent" })
            }
            res.status(200).json({ paymentIntent: updated_intent })
            return
            }
        } else {
            //Create a new order with prisma
            const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            })

            orderData.paymentIntentID = paymentIntent.id
            const newOrder = await prisma.order.create({
            data: orderData,
            })
            res.status(200).json({ paymentIntent })
  }
}

