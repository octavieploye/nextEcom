import { create } from "zustand";
import { persist } from "zustand/middleware";  // <-- import persist all the data in your local storage 
import { AddCartType } from "./type/AddCartType";

//This file: store.ts is a zustand requirement as per Documentation

type CartState = {
    isOpen: boolean;
    cart: AddCartType[];
    toggleCart: () => void;
    clearCart: () => void;
    addProduct: (item: AddCartType) => void;
    removeProduct:(item: AddCartType) => void;
    paymentIntent: string;
    setPaymentIntent: (val: string) => void;
    onCheckout: string;
    setCheckout: (val: string) => void;
   

}

export const useCartStore = create<CartState>() (
    persist(
        // "set" is a function that updates the data in your state
        (set) => ({
            cart: [],
            isOpen: false,
            paymentIntent: "",
            onCheckout: 'cart',
            // "state" is the current state of the whole cartStore
                toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
                        addProduct: (item) => set((state) => {

                            // Check if the item already exists in the cart
                            const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
                            if (existingItem) {
                                
                                // If the item already exists, update the quantity by 1
                                    const updatedCart = state.cart.map((cartItem) => {
                                        if (cartItem.id === item.id) {
                                            return { ...cartItem, quantity: cartItem.quantity! + 1 }
                                        }    
                                        return cartItem;
                            })
                                    return {cart: updatedCart}
                                    // Else keep everything the way it was,add the new item to the cart
                                } else {
                                    return {cart: [...state.cart, {...item, quantity: 1}]}
                                        
                                }
              
                        }),
                        // item.id IT'S THE ITEM THAT WE ARE PASSING IN DOWN product/addCart.tsx
                        // by doing this we are making sure that we are passing the same product than we are in  our  state
                        removeProduct:(item) => set((state) => {
                            // Check if the item already exists in the cart
                            const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
                            if (existingItem && existingItem.quantity! > 1) {
                                const updatedCart = state.cart.map((cartItem) => {
                                    if(cartItem.id === item.id) {
                                        return {...cartItem, quantity: cartItem.quantity! - 1}
                                    }
                                    return cartItem;
                                })
                                return {cart: updatedCart}
                            }else{
                                // REMOVE ITEM FROM CART
                                const filteredCart = state.cart.filter((cartItem) => cartItem.id !== item.id)
                                return {cart: filteredCart}
                            }
                        }),
                    setPaymentIntent: (val) => set((state) => ({ paymentIntent: val })),
                    setCheckout: (val) => set((state) => ({ onCheckout: val })), 
                    clearCart: () => set((state) => ({ cart: [] })),  
                            
         }),
            { name: "cart-store"}
    )
)