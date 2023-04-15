'use client'

import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useCartStore } from "@/store"
import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"

// We add the ! to the end of the env variable to tell TypeScript that we know it will be there
// We ned to add NEXT_OUBLIC TO STRIPE_PUBLISHABLE_KEY because we are using the env variable in the front-end(client-side)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Checkout() {
    const cartStore = useCartStore()
    const router = useRouter()
    // WE NEED TO CREATE A STATE TO STORE THE CLIENT SECRET as thte customer will need a client secret
    const [clientSecret, setClientSecret] = useState("")

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads up
        // EVERY PAYMENT AS A PAYMENT INTENT ID ASSOCIATED WITH IT. IF WE DON'T DO THIS WILL BE CREATING A NEW ORDER AND A NEW ORDER ID
       
                fetch("/api/create-payment-intent", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        items: cartStore.cart,
                        payment_intent_id: cartStore.paymentIntent,
                    }),
                })
                // IF THE USER IS NOT LOGGED IN AT THE CHECKOUT, WE WANT THE USER TO SIGNIN
                .then((res) => {
                    if(res.status === 403){
                        // IF THE RESPONSE HAS THE status 403 WE REDIRECT TO THE SIGNIN PAGE
                       return  router.push ('/api/auth/signin')
                    }
                    // set the client secret and the payment intent associated with the order
                    return res.json()

                // WE HAVE ACCESS TO ACTUAL DATA FROM THE RESPONSE
                }).then((data) => {
                    console.log(data)
                    setClientSecret(data.paymentIntent.client_secret)
                    cartStore.setPaymentIntent(data.paymentIntent.id)
                })
            
    },[])

    return (
        <div>
            <h1>Here is the checkout PAGE</h1>
        </div>
    )
}