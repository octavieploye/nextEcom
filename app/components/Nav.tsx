'use client'

import { Session } from "next-auth"
import {signIn, signOut} from 'next-auth/react'
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"

// We set the getter for the Cart component
import Cart from "./Cart"
import { useCartStore } from "@/store"
import { AiFillShopping } from "react-icons/ai"

// This is a component that will be used in the layout.tsx file as to fetch the user
export default function Nav({user} : Session) {
    // We set the getter for the Cart component
    const cartStore = useCartStore();
    return (
        <nav className="flex
         justify-between items-center py-12">

                {/* adding a home button */}
                <Link href='/'>
                <h1 className="text-bold h-8 px-4 text-sm text-center flex justify-center py-1
                transition-colors 
                bg-primary-focus
                on-colors duration-150 
                hover:bg-primary
                focus:shadow-outline
                rounded-lg
                text-white">Home</h1>
                </Link>

    <ul className=" flex items-center gap-12">
            
           
        {/* Adding the shoping Icon & Toggle the cart */}
         <li onClick={() =>cartStore.toggleCart() } className=" flex items-center text-3xl relative cursor-pointer">
            <AiFillShopping />

            <AnimatePresence>   
            {/* Adding the number of item in the Cart */}
            {cartStore.cart.length > 0 && (
            <motion.span          // We use motion.span to animate the number of items in the cart
            animate={{ scale: 1}} 
            initial={{scale: 0}} 
            exit={{scale: 0}}
            className="bg-primary-focus  text-white text-sm font-bold w-5 h-5 rounded-full absolute left-4 bottom-4 flex items-center justify-center ">
                {cartStore.cart.length}
            </motion.span>
            )}
            </AnimatePresence>
         </li>
        {/* /* {Here we are checking if the user is not signed in}  */}
        {!user && (
            // We need to add a <div> here because we can't return two elements in next
             
                <li className="h-8 px-4 text-sm text-center flex justify-center
                bg-primary-focus
                text-white
                transition-colors 
                 rounded-lg focus:shadow-outline 
                on-colors duration-150 
                hover:bg-primary">
                
                    <button onClick={() => signIn()}>Sign In</button>
                </li>


        )
       
}
        {/* {Here we are checking if the user is signed in} */}
        {user && (
            //Allow user to access thier dashboard from their profile picture
            <li>        
                 {/*Here we initiate the dropdown to the checkout dashboard and signout  */}
                <div className="dropdown dropdown-end cursor-pointer">
                    <Image
                    src={user?.image as string }
                    width={36}
                    height={36}
                    alt={user.name as string}
                    className="rounded-full "
                    tabIndex={0}
                    />
                    <ul 
                    tabIndex={0} 
                    className="dropdown-content menu p-4 space-y-4 shadow bg-base-100 rounded-box w-72">
                    <Link 
                            href="/dashboard" 
                            // Close the dropdown when the user click on the link
                            onClick={() => {if (document.activeElement instanceof HTMLElement) {
                                document.activeElement.blur()
                            }}}
                            className="hover:bg-base-300 p-4 rounded-md">
                        Check Your Orders
                    </Link>
                    {/* SignOut */}
                    <li 
                        className="hover:bg-base-300 p-4 rounded-md"
                            onClick={() => {
                                signOut()
                                if (document.activeElement instanceof HTMLElement) {
                                    document.activeElement.blur()
                            }}}
                    >
                        Sign Out
                    </li>
                    </ul>
                </div>
            </li>
            
           
            )}
    </ul>
    <AnimatePresence>{cartStore.isOpen && <Cart />}</AnimatePresence>
</nav>
    )
}