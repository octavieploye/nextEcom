'use client'

import { useCartStore } from "@/store"
import { AddCartType } from "@/type/AddCartType"

export default function AddCart({unit_amount, id, name, image, quantity} : AddCartType) {
    const cartStore = useCartStore();

        return (
            <>
            <button 
            onClick={() => 
            cartStore.addProduct({id, image, unit_amount, quantity, name})}  
            className="m-12 text-white py-2 px-6 font-medium rounded-md bg-pink-500">
                Add to cart
            </button>
            </>
        )
}