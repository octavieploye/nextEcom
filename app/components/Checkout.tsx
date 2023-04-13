'use client'

import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useCartStore } from "@/store"
import { useState,useEffect } from "react"

// We add the ! to the end of the env variable to tell TypeScript that we know it will be there
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Checkout() {
    const cartStore = useCartStore()
    const [clientSecret, setClientSecret] = useState("")

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads up
        window
            .fetch("/api/create-payment-intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: cartStore.cart,
                    payment_intent_id: cartStore.paymentIntent,
                }),
            })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                setClientSecret(data.clientSecret)
            })
    }
}