import Image from "next/image"
import { SearchParamsType } from "@/type/SearchParamsType"
import formatPrice from "@/Utility/PriceFormat"


export default async function Product ({searchParams} : SearchParamsType) {
    
    
    return (
        <div className="flex justify-between gap-24 p-12 text-gray-700-700">

            <Image 
                src={searchParams.image} 
                width={500} 
                height={500} 
                alt={searchParams.name}  
             /> 
            <div className="font-medium text-gray-500">

                <h1 className="text-2x1  py-2 ">{searchParams.name}</h1>
                    <h2 className="py-2">{searchParams.description}</h2>
                    {/* TODO: Fix  metadata: { features: '' } String is empty - no error */}
                    <p>{searchParams.features}</p>

                    <div className=" flex gap-2">
                            <p className="font-bold text-sm decoration-from-font text-blue-700 ">
                            {searchParams.unit_amount && formatPrice(searchParams.unit_amount)}</p>
                    </div>

                        <button 
                        className="my-12 text-white py-2 px-6 font-medium rounded-md bg-blue-900">
                        Add to cart</button>
            </div>
        </div>   
    )
}