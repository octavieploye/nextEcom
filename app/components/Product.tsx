import Image from 'next/image'
import formatPrice  from '@/Utility/PriceFormat'
import { ProductType } from  '@/type/ProductType'
import Link from 'next/link'


export default function Product({name, image, description, price, id} : ProductType) {
            return (
                //TODOs:  dynamic rendering of the product page - Product.tsx
   
          
<ul>
        {/* In order to size the image as the current width  & height are only impacting 
            the resolution, we need to add a className in <image /> & then we change the pic size */}
            <li><Image src={image} width={800} height={800} alt={name}  className='object-cover w-160 h-70 rounded-lg'  /></li>
            <li className='font-medium py-0.5 text-gray-700'>Titre  : {name}</li>
            <li className='text-sm decoration-from-font text-blue-700 '>Prix : {price && formatPrice(price as number)}</li>
        
</ul>
            
    )
}