// * This component is used to display the product card in the home page

import Image from 'next/image'
import formatPrice  from '@/Utility/PriceFormat'
import { ProductType } from  '@/type/ProductType'
import Link from 'next/link'
import AddCart from '../product/[id]/AddCart'




export default function Product({name, image, description, unit_amount, id, metadata, quantity} : ProductType) {
        const { features } = metadata 
       
    return (
    
   <Link href={{pathname: `/product/${id}`, query: {name, quantity, image,unit_amount, description, id, features}}}>
        
<div>

        {/* In order to size the image as the current width  & height are only impacting 
            the resolution, we need to add a className in <image /> & then we change the pic size */}
            <Image 
            src={image} 
            width={800} 
            height={800} 
            alt={name} 
            priority={true} 
            className='object-cover w-auto h-auto rounded-lg drop-shadow-xl'  />
            {/* PRODUCT CARD INFO */}
            <p className='font-medium py-3'>Nom  : {name}</p>
            <p className='text-sm decoration-from-font text-primary-focus'>Prix : {unit_amount && formatPrice(unit_amount as number)}</p>
            <div>
                <AddCart id={id} name={name} image={image} unit_amount={unit_amount} />
            </div>
</div>

</Link>          
              
    )
}