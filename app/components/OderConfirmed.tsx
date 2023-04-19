'use clent'

import {motion} from 'framer-motion'
import Image from 'next/image'
import cool from '@/public/cool.gif'

export default function OrderConfirmed() {
    return (
        <motion.div initial={{ scale: 0.5, opacity: 0}}  animate={{scale: 1, opacity: 1}} >
            <h1>Thank you! Your Order has been placed</h1>
            <h2>Check your inbox for the receipt</h2>
            <Image src={cool} className='py-8 rounded-full' alt='cool gorilla with headphones'/>
        </motion.div>
    )
}