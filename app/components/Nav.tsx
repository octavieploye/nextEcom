'use client'

// import { Session } from "inspector"
import { Session } from "next-auth"
import {signIn} from 'next-auth/react'
import { signOut } from "next-auth/react"
import Image from "next/image"

// This is a component that will be used in the layout.tsx file as to fetch the user
export default function Nav({user} : Session) {
    return (
        <nav className=" bg-pink-200 rounded-md flex justify-between items-center py-8">
    <h1>This is a navbar</h1>

    <ul className=" flex items-center gap-12">
    
        {/* /* {Here we are checking if the user is not signed in}  */}
        {!user && (
            // We need to add a <div> here because we can't return two elements in next
             
                <li className="bg-teal-600 text-white py-4 px-4 rounded-md">
                
                    <button onClick={() => signIn()}>Sign In</button>
                </li>
        )
}
        {/* {Here we are checking if the user is signed in} */}
        {user && (
            // We need to add a <div> or Fragment <> here because we can't return two elements in next
            <div>
                <span>
                   Welcome Back {user.name}
                </span>              
                <li className="inline-block"> <Image src={user?.image as string } width={48} height={48} alt={user.name as string} className="rounded-full"/></li>
                <li className="bg-amber-400 text-white py-4 px-4 rounded-md">
                    <button onClick={() => signOut()}>Sign Out</button>
                </li>
            </div>
            )
        }

    </ul>
        </nav>
    )
}