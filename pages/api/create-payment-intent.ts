import { authOptions } from '@/pages/api/auth/[...nextauth]';
import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { AddCartType } from '@/type/AddCartType';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion:"2022-11-15"
})

const prisma = new PrismaClient();

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

    if(payment_intent_id) {
        const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

        // IF THE CURRENT_INTENT EXIST- UPDATE THE INTENT WITH THE NEW VALUE THAT WE HAVE IN OUR CART(IF THE USER MODIFIES ITS CART)
        if(current_intent) {
            const updated_intent = await stripe.paymentIntents.update(
                // WE CHECK WHICH PAYMENT ID TO UPDATE
                payment_intent_id,
                // WE UPDATE TO THE NEW VALUE
                { amount: calculateOrderAmount(items) }
                )
                console.log("we got an updated intent", updated_intent)

            // Fetctch order with the product id
            const order_exist = await prisma.order.findFirst({
                where: {paymentIntentID: payment_intent_id},
                include: {products: true}
            })
            // if the order does not exist
            if(!order_exist) {
                res.status(400).json({message: "Invalid Payment Intent"})
                return;
            }
            // Update existing Order AND PUSH THE NEW PRODUCTS IN THE ORDER
            const updated_order = await prisma.order.update({
                where: {id: order_exist.id},
                data: {
                    amount: calculateOrderAmount(items),
                    products: {
                    // DELETE ALL THE PRODUCTS IN THE ORDER
                        deleteMany: {},
                    // ADD THE NEW PRODUCTS IN THE ORDER
                        create: items.map((item) => ({
                            name: item.name,
                            description: item.description || null,
                            unit_amount: parseFloat(item.unit_amount),
                            image: item.image,
                            quantity: item.quantity,
                        })),
                    },
                },
            })
            console.log("we got an updated order", updated_order)
            res.status(200).json({message: "Order updated"})
            return;
        }
    } else {
        // IF NO PAYMENT_INTENT_ID EXIST WE CREATE A PAYMENT INTENT
        /**
         * 1. We create a STRIPE payment intent ID with the amount that we have in our cart
         */
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: "eur",
            automatic_payment_methods: { enabled: true },
        })
        // CREATE A NEW ORDER WITH PRISMA
        /**
         * 2. We create a new order DATABASE IN PRISMA THAT WIL BE MARK AS 'PENDING
         */
        orderData.paymentIntentID = paymentIntent.id;
        const newOrder = await prisma.order.create({
            data: orderData,
        })
        /**
         * 1.THEN WE SEND BACK PAYMENTINTENTID OVER TO THE FRONTEND CODE TO SAVE IT IN THE STATE
         * 2.THIS ALLOW THE USER TO SAVE HIS CART AND COME BACK LATER TO PAY FOR IT
         * 3.ONCE THE PAYMENT INTENT IS CREATED WE WILL BE RUNNING THE IF STATEMENT ABOVE
         * 3. WE ALSO SEND BACK THE ORDER ID TO THE FRONTEND CODE TO USE IT FOR THE ORDER CONFIRMATION PAGE
         */
        res.status(200).json({paymentIntent})
    }
    
}