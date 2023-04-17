import Image from 'next/image'
import formatPrice  from '@/Utility/PriceFormat'
import { ProductType } from  '@/type/ProductType'
import Link from 'next/link'


export default function Product({name, image, description, unit_amount, id, metadata, quantity} : ProductType) {
        const { features } = metadata    
    return (
                //TODOs:  dynamic rendering of the product page - Product.tsx
    
   <Link href={{pathname: `/product/${id}`, query: {name, quantity, image,unit_amount, description, id, features}}}>
        
<div>

        {/* In order to size the image as the current width  & height are only impacting 
            the resolution, we need to add a className in <image /> & then we change the pic size */}
            <Image src={image} width={800} height={800} alt={name}  className='object-cover w-160 h-70 rounded-lg'  />
            <p className='font-medium py-0.5 text-gray-700'>Titre  : {name}</p>
            <p className='text-sm decoration-from-font text-blue-700 '>Prix : {unit_amount && formatPrice(unit_amount as number)}</p>
            
</div>

</Link>          
              
    )
}