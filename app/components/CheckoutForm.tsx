'use client'

import { useState, useEffect } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import formatPrice from "@/Utility/PriceFormat"
import { useCartStore } from "@/store"


export default function CheckoutForm({clientSecret}: {clientSecret: string}) {

    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)

    const cartStore = useCartStore()

    const totalPrice = cartStore.cart.reduce((acc, item) => {
        return acc + item.unit_amount! * item.quantity!
    }, 0)

    const formattedPrice = formatPrice(totalPrice)

    /** annotations
     * We pass a useEffect to check if everything is mounted  correctly
     * If YES then if should execute our Form
     */
useEffect(() => {
    // If there is no stripe initialised then return(doesn't render out the form)
    if(!stripe){
        return
    // If there is no clientSecret then return(doesn't render out the form)
    } if(!clientSecret){
        return
    }
    // In the depency array we pass the stripe
}, [stripe])
                /**
                 * We need to define what type of event we are handling with the React.FormEvent
                 * We can see hovering on handleSubmit that it is a React.FormEvent
                 * @param e handle the submit event of the Form
                 * @returns 
                 */
                    const handleSubmit = async (e: React.FormEvent) => {
                // SECURITY: We need to prevent the default behaviour of the form(refreshing the page when clicking on the submit button    )
                        e.preventDefault()
                  //SECURITY CHECK:  If there is no stripe or elements then stripe has not been loaded yet and we cannot do anything with the page
                        if(!stripe || !elements){
                            return
                        }
                    // SECURITY CHECK: As soon as the user clicks on the submit button we set the isLoading to true
                    // To avoid the user to click multiple times on the submit button(could create multiple transactions)
                        setIsLoading(true)

                    // We then need to confirm the payment 
                        stripe
                            .confirmPayment( {
                    // We pass the elements for validation checks9if the cart is correct..etc)
                                elements,
                    // We don't want the customer to redirect to a success or fail page. Hence we use : "if_required"
                                redirect: "if_required",

                        })
                        .then((result) => {
                            if(!result.error){
                    //We SET the checkout to success -  Reference to the store.ts we have onCheckout: "cart". 
                    //Here we will have a "Success" component
                                cartStore.setCheckout("Success")
                                console.log('Payment Successful')
                            }
                            setIsLoading(false)
                        })
                    }

    return (
        // CHECKOUT FORM

        <form className="text-gray-600"  onSubmit={handleSubmit} id='payment-form' >

            <PaymentElement id="PaymentElement" options={{layout: 'tabs'}}  />
            <h1 className="text-sky-800 text-sm font-bold">Total: {formattedPrice} </h1>

            <button className={`py-2 mt-4 w-full bg-sky-700 text-white rounded-md disabled:opacity-25`}  id='submit' disabled={isLoading || !stripe || !elements}  >
                  <span>
                    {isLoading ? <span>Processing...👀</span> : <span> Pay Now </span>}
                </span>
            </button>
        
        </form>
    )

}