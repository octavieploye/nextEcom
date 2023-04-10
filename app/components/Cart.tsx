'use client';

import Image from "next/image";
import { useCartStore }from "@/store";
import formatPrice from "@/Utility/PriceFormat"

export default function Cart() {
    const cartStore = useCartStore();
    console.log(cartStore.isOpen)
    return (
        <div onClick={() => cartStore.toggleCart()}  
        className="fixed w-full h-screen left-0 top-0 bg-black/25">
           <div  onClick={(e) =>e.stopPropagation()} 
           className="bg-gray-100 absolute right-0 top-0 w-1/4 h-screen p-12 overflow-y-scroll text-gray-500">
                <h1> Here is your shopping list  📃</h1>
                {cartStore.cart.map((item) => (
                    <div className="flex py-4 gap-4">
                        <Image className="rounded-md h24"  src={item.image} width={120} height={120} alt={item.name} />
                        <div>
                            <h2 className="mb-4 font-bold" >{item.name}</h2>
                            <h2>Quantity: {item.quantity}</h2>
                            <p className="text-sm" >Price: {item.unit_amount && formatPrice(item.unit_amount)}  </p>
                        </div>
                        
                    </div>
                ))}
                <button className="py-2 mt-4 bg-sky-700 text-white w-full rounded-md">
                    Checkout
                </button>
           </div>
        </div>
    )
    
}