import { create } from "zustand";
import { persist } from "zustand/middleware";  // <-- import persist all the data in your local storage 
import { AddCartType } from "./type/AddCartType";


type CartState = {
    isOpen: boolean;
    cart: AddCartType[];
    toggleCart: () => void;
    // clearCart: () => void;
    addProduct: (item: AddCartType) => void;
    removeProduct:(item: AddCartType) => void;
    // paymentIntent: string;
    // onCheckout: string;
    // setPaymentIntent: (val: string) => void;
    // setCheckout: (val: string) => void;
   

}
//TODO!! Duplicate items in cart when addingPRoduct directly from the cart
// TODO when adding Product fromt the Add to Cart button qty is not added in the shopping counter. However the quantity shows in the cartView but cannot be removed with the remove Product button
export const useCartStore = create<CartState>() (
    persist(
        // "set" is a function that updates the data in your state
        (set) => ({
            cart: [],
            isOpen: false,
            // "state" is the current state of the whole cartStore
                toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

                // Add Item to Cart
                addProduct: (item) => set((state) => {

                            // Check if the item already exists in the cart
                            const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
                            
                            if (existingItem) {
                                
                                // If the item already exists, update the quantity by 1
                                    const updatedCart = state.cart.map((cartItem) => {
                                        if (cartItem.id === item.id) {
                                            return {
                                                ...cartItem,
                                                quantity: cartItem.quantity! + 1
                                            }
                                        }    
                                        return cartItem;
                                    })
                                    return {cart: updatedCart}
                                    // Else keep everything the way it was,add the new item to the cart
                                } else {
                                    return {
                                        cart: [...state.cart, {...item, quantity: 1}]
                                            }
                                        }
                                    
                }),
                // Remove Item from Cart
                removeProduct: (item) => set((state) => {

                    // Check if the item already exists in the cart & remove quantity -1
                    const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
                    // If the item already exists, update the quantity by 1
                    if (existingItem && existingItem.quantity! > 1) {

                        // If the item already exists, update the quantity by 1
                        const updatedCart = state.cart.map((cartItem) => {
                            if (cartItem.id === item.id) {

                                return {
                                    ...cartItem,
                                    quantity: cartItem.quantity! - 1
                                }
                            }
                            return cartItem;
                        })
                        return {cart: updatedCart}
                    } else {
                        // Remove the item from the cart
                        const filteredCart = state.cart.filter((cartItem) => cartItem.id !== item.id);
                        return {cart: filteredCart}
                    }
                })
                
                        
                
        }),
    { name: "cart-store"}
    )
)