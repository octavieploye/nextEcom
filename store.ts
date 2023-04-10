import { create } from "zustand";
import { persist } from "zustand/middleware";  // <-- import persist all the data in your local storage 

type CartItem = {
    id: string;
    name: string;
    images?: string[];
    description: string;
    unit_amount: number;
    quantity: number;
}

type CartState = {
    isOpen: boolean;
    cart: CartItem[];
    toggleCart: () => void;
}

export const useCartStore = create<CartState>() (
    persist(
        // "set" is a function that updates the data in your state
        (set) => ({
            cart: [],
            isOpen: false,
            // "state" is the current state of the whole cartStore
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
        }),
    { name: "cart-store"}
    )
)