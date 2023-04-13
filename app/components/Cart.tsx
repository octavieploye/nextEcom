'use client';

import Image from "next/image";
import { useCartStore }from "@/store";
import formatPrice from "@/Utility/PriceFormat"
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5"
import basket from "@/public/basket.png"
import { motion, AnimatePresence } from "framer-motion"


export default function Cart() {
    const cartStore = useCartStore();
    console.log(cartStore.isOpen)

    // Total price of all items in the cart
    // acc = accumulator
    const totalPrice = cartStore.cart.reduce((acc, item) => {
        return acc + item.unit_amount! * item.quantity!
    }, 0)


    return (
        // We use the isOpen property to toggle the cart
        // We use the motion.div to animate/fade in & fade out the cart
        <motion.div 
        initial={{opacity:0}}
        animate={{opacity:1}}
        exit={{opacity:0}}
        onClick={() => cartStore.toggleCart()}  
        className="fixed w-full h-screen left-0 top-0 bg-black/25">
            {/*  */}
           <motion.div 
           layout
           onClick={(e) =>e.stopPropagation()} 
           className="bg-gray-100 absolute right-0 top-0 w-1/4 h-screen p-12 overflow-y-scroll text-gray-500">
                <h1> Here is your shopping list  📃</h1>
                {cartStore.cart.map((item) => (
                    <motion.div layout key={item.id}   className="flex py-4 gap-4">
                        <Image className="rounded-md h24"  src={item.image} width={120} height={120} alt={item.name} />
                        <motion.div layout>
                            <h2 className="mb-4 font-bold" >{item.name}</h2>
                            {/* update quanity of a product */}
                            <div className="flex gap-2">
                                <h2>Quantity: {item.quantity}</h2>
                                    <button onClick={() => 
                                        cartStore.removeProduct({
                                            id: item.name, 
                                            quantity: item.quantity, 
                                            name: item.name, 
                                            image: item.image,
                                            unit_amount: item.unit_amount,})} >
                                        <IoRemoveCircle/>
                                    </button>
                                    <button onClick={() => 
                                        cartStore.addProduct({
                                            id: item.name, 
                                            quantity: item.quantity, 
                                            name: item.name, 
                                            image: item.image,
                                            unit_amount: item.unit_amount,})} >
                                                
                                        <IoAddCircle/>
                                    </button>
                            </div>
                            <p className="text-sm" >Price: {item.unit_amount && formatPrice(item.unit_amount)}  </p>
                        </motion.div>
                        
                    </motion.div>
                ))}
                {/* Checkout and Total */}
                    {cartStore.cart.length > 0  && (
                <motion.div layout>
                <p>Total:     { formatPrice (totalPrice)}</p>
                {/* When basket is not empty */}
                    <button className="py-2 mt-4 bg-sky-700 text-white w-full rounded-md">
                        Checkout
                    </button>
                    
                </motion.div>
                    )}
                {/* Animate the cart when the cart is empty */}
                <AnimatePresence>
                    {/* When basket is empty -emptybasketView  */}
                    {!cartStore.cart.length && (
                        <motion.div
                        animate={{scale:1, rotateZ: 0, opacity:0.75}}
                        initial={{  scale:0.5, rotateZ: -10, opacity:0}}
                        exit={{scale:0.5, rotateZ: -10, opacity:0}}
                        className="flex flex-col items-center gap-12 text-2x1 font-medium pt-56 opacity-75">
                        <h1>Uhhh Ohhhh...it's empty 🥹</h1>
                        <Image src={basket} alt='empty cart' width={200} height={200}  />
                        </motion.div>
                    
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    )
    
}