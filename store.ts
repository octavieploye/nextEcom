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
}

export const useCartStore = create<CartState>() (
    persist(
        (set) => ({
            cart: [],
            isOpen: false,
        }),
    { name: "cart-store"}
    )
)