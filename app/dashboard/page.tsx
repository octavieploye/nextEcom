import formatPrice from "@/Utility/PriceFormat";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import Image from "next/image";


// Revalidates every time a uservisit the page
export const revalidate = 0;

const fetchOrders =async() => {
    const  prisma = new PrismaClient();
    const user = await getServerSession(authOptions);
    if(!user){
        return null
    }

        const orders = await prisma.order.findMany({
            where: {userId: user?.user?.id},
            include: {products:true},
            orderBy: {createDate: 'desc'},
            })
            return orders;
        }
// Check your order page
export default async function Dashboard() {
    const orders = await fetchOrders();
 
    // Conditional rendering is needed as an order can be null
    if(orders === null){
        return <p> You need to be logged in to view your orders </p>
    }

    return (
        <div>
            {orders.length === 0 ? <p>You have no orders 🥹</p> : <h1 className="font-bold" > Your Orders</h1>}
            <div className=" font-light">
                {orders.map((order) => (
                    <div key={order.id}    className="rounded-lg p-8 my-4 space-y-2 bg-base-200">
                        <h2 className="text-xs font-medium">Order reference: {order.id}</h2>
                        <p className="text-xs">Status: <span className={`${order.status === 'complete' ? 'bg-primary-focus' : 'bg-neutral-focus'}
                         text-white py-1 rounded-md px-2 mx-2 text sm`}
                         >  
                            {order.status}
                            </span>
                        </p>
                         <p className="text-xs">Order Date: {new Date(order.createDate).toLocaleDateString('en-GB')}</p>
                        <div className="text-sm lg:flex items-center gap-2">
                            {order.products.map((product) => (
                                <div className="py-1" key={product.id}>
                                        <h2 className="py-2 " key={product.name}>{product.name}</h2>
                                    <div className="flex lg:w-1/2 gap-4">
                                        <Image 
                                        src={product.image!}
                                        width={120}
                                        height={120}
                                        alt={product.name}
                                        />
                                        <div className="py-1" >
                                            <p className="py-1">Quantity:{product.quantity} </p>
                                            <p className="text-neutral">{formatPrice(product.unit_amount)}</p>
                                        </div>
                                    </div>
                                
                                </div>
                                
                                ))}
                           </div> 
                            <p className="flex font-bold text-primary-focus">Total: {formatPrice(order.amount)}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}