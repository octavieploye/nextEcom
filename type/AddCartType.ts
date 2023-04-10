export type AddCartType = {
    id:string
    name: string;
    image: string;
    quantity?: number | 1;
    unit_amount: number | null;
}