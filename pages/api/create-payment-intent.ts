import { authOptions } from '@/pages/api/auth/[...nextauth]';
import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion:"2022-11-15"
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // GET THE USER
    const userSession = await getServerSession(req, res, authOptions);
          if(!userSession) {
              res.status(403).json({message: "You are not logged in"})
              return;
          }
    // EXTRAT THE DATA FROM THE BODY
    const {items, payment_intent_id} = req.body;

    res.status(200).json({userSession})
    return
    // DATA NECESSARY TO CREATE THE ORDER

    // const orderData ={
    //     user: {connect: {id: userSession.user.id}},
    // }
}