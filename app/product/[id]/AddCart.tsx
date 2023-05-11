'use client'

import { useCartStore } from "@/store"
import { AddCartType } from "@/type/AddCartType"
import { useState } from "react"

export default function AddCart({unit_amount, id, name, image, quantity} : AddCartType) {
    const cartStore = useCartStore();
    // Add a message when an item is added in the cart
    const [added, setAdded] = useState(false)

    const handleAddToCart = () => {
        
        cartStore.addProduct({id, image, unit_amount, quantity, name})
        setAdded(true)
        setTimeout(() => {
            setAdded(false)
        }, 500)
    }

        return (
            <>
            <button 
            onClick={handleAddToCart} 
            disabled={added}
            className="my-4 btn btn-primary w-auto">
               
                    
                        {!added && <span> Add To Cart </span>}
                        {added && <span> Adding To Cart </span>}
                   
               
            </button>
            </>
        )
}