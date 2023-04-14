import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Stripe from "stripe"


const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
        // Typescript complains about the following two lines either it is a string or undefined
        // We definitely have the values in the .env.local file
        // So we are using the as string to tell Typescript that we are sure about the values
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    //Add more providers here
  ],

  

  events: {
    createUser: async ({user}) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion:"2022-11-15"
        })
        // Create a customer in Stripe
        // To do this we need to have the user's email and name
        //To avoid the warning message as user is a string or undefined we will use the if statement
        if(user.name && user.email) {
                const costomer = await stripe.customers.create({
                    email: user.email || undefined,
                    name:user.name    || undefined,
                })
            
                // Update the user prisma in the database with the stripeCustomerId
                await prisma.user.update({
                    where: {
                      id: user.id
                    },
                    data: {
                        stripeCustomerId: costomer.id
                    },
                })
          }
      },  
  },

  // This is the function that will be called when the user is logged in
  // we fetched the ID and the StripeCustomerID which we will need to checkout the order
  callbacks: {
    async session({session, token,user}) {
      session.user = user
      return session
    },
  },
}

export default NextAuth(authOptions)