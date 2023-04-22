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
                    <div key={order.id}    className="rounded-lg p-8 my-12">
                        <h2>Order reference: {order.id}</h2>
                        <p>Time: {new Date(order.createDate).toLocaleDateString('en-GB')}</p>
                        <p>Status: <span className={`${order.status === 'complete' ? 'bg-sky-700' : 'bg-amber-700'}
                         text-white py-1 rounded-md px-2 mx-2 text sm`}
                        >  
                            {order.status}
                            </span>
                        </p>
                        <p className="font-medium">Total: {formatPrice(order.amount)}</p>
                        <div className="flex gap-8 flex-col">
                            {order.products.map((product) => (
                                <div className="py-2" key={product.id}>
                                    <h2 className="py-2" key={product.name}></h2>
                                    <div className="flex items-center gap-4">
                                        <Image 
                                        src={product.image!}
                                        width={36}
                                        height={36}
                                        alt={product.name}
                                        />
                                        <p>{formatPrice(product.unit_amount)}</p>
                                        <p>Quantity:{product.quantity} </p>
                                    </div>
                                
                                </div>
                                
                            ))}
                           </div> 
                    </div>
                ))}
            </div>
        </div>
    )
}