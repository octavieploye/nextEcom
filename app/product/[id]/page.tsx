import Image from "next/image"

export default async function Product ({searchParams}) {
    
    return (
        <div className="flex justify-between gap-24 p-12 text-gray-700-700">

            <Image 
            src={searchParams.image} 
            width={500} 
            height={500} 
            alt={searchParams.name}  
             /> 
            <div>

            <h1>{searchParams.name}</h1>
            <h2>{searchParams.Description}</h2>
            </div>
         </div>   
    )
}