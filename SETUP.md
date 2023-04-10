I. Installation
**hydration error see XI**

- Install node
- create next-app 13.2.4
- Install tailwindcss
- Access db railway or superbase and set an .ENV file with the DATABASE_URL
- Install prisma 
- Install zustand 4.3.3
- Install react-icons

yarn add prisma ts-node @prisma/client

- connect Prisma to the DB  
         --> we create a folder under Prisma at the root of the project
         --> then we create a file schema.prisma
         --> get started in prisma.com

         https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgres

        --> we connect to the db 
         --> we then settup a model in the schema.prisma file
         --> then in the terminal we can run the following command:

         yarn prisma migrate dev

         --> we enter the name of the model

         --> Then we go back to railway and can see that the db has been created and connected  

         II. Authentification

         For this we use next-auth Prisma   https://authjs.dev/
         https://authjs.dev/reference/adapter/prisma

             --> In the command we run   yarn add next-auth @next-auth/prisma-adapter
             --> Then we need to delete the api folder inside the app folder and create a folder pages from the root project(see doc on link above)
             --> Inside the pages folder we then create an api folder
             --> from the api folder we create a auth folder then we create a file with the following: [...nextauth].ts

             Then we import the adapter as per the SETUP in next-auth doc above in the file next-auth we created above:
    
    --> Then we need to create a ggogle sessionas a google provider
     
     https://console.cloud.google.com/getting-started?hl=fr

     Then we create a new project name
     Then we go to API/services -> Credentials-> Créer un ID client OAuth and fill the consent window(external for now as it is a test)
     =================
 1- Create the ID client

 https://console.developers.google.com/apis/credentials

The "Authorized redirect URIs" used when creating the credentials must include your full domain and end in the callback path. For example;

    For production: https://{YOUR_DOMAIN}/api/auth/callback/google
    For development: http://localhost:3000/api/auth/callback/google

     we can use https://next-auth.js.org/providers/google to fillout following the documentation
     https://developers.google.com/identity/protocols/oauth2

     Once Created we get (example):
     -  Client ID: 151479428562-svva8r69gpe3c5v0k0rvi4b55t5ae5bt.apps.googleusercontent.com
     -  Secret code: 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

     We will then need to create a .env.local file to add the above credentials

     2- Fill the consent and validation
     ====================================

       
       3- Then back to our schema.prisma we can add the schema model from nextAuht

       https://authjs.dev/reference/adapter/prisma#setup

       Then we run:
         -> yarn prisma migrate dev 
         -> prisma generate
         -> yarn dev

      4- we can then verify if the signin up is working by going to http://localhost:3000/api/auth/signin in the browser. This can be reflected in the user table in rail where we can see the signin

II. Stripe Installation:
     https://dashboard.stripe.com/test/dashboard
   - we then are going to  add the publishable key and the secret key onto our .env.local file

   - in the schema.prisma user model we will add:   stripeCustomerId String?
   - and we will remove ourself from rail user database. hence we need to close the server and migrate to update the change we just made.

   - Then in the next-auth file we can run events asynchroneous function that does not wait for a response. This will allow us to set the different steps of account creation:
          # createUser

             }),
    //Add more providers here
  ],
  events: {
    createUser: async ({user}) => {
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string , {
            apiVersion:"2022-11-15"
    }
  },
   
   - We now will be adding stripe with the command: yarn add stripe
   - we will import stripe in the next-auth file 

    - after creating the user login we will now create a Stripe customer that connect to the database

    // Create a customer in Stripe
        // To do this we need to have the user's email and name
        //To avoid the warning message as user is a string or undefined we will use the if statement
        if(user.name && user.email) {
        const customer = await stripe.customers.create({
            email: user.email,
            name:user.name
        })
        // Update the user prisma in the database with the StripeCustomer
        await prisma.user.update({
            where: {
               id: user.id
            },
            data: {
                StripeCustomer: customer.id

                
                
** We can then verify if it works running: 

-  [http://localhost:3000/api/auth/signout](http://localhost:3000/api/auth/signin)

Then refreshing Strip dashboard and rail we should see our new customer created and the stripeCustomerId have been generated in the database.

           - We can also check when signout and signing that the user does not change as this fonction only works when the user is created


III. NavBar
    1- 
       - As we will be using the authentication in our Navbar, We need to be able to export the  option/object we passed  in the function. Hence we will modify the nextAuth function and pass it into a constante that will then be passed through it as an export default.

       export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [

    add the end after the final parenthesis wee add:

    export default NextAuth(authOptions)
    
    2- then we create a components in app  and add a new file Nav.tsx

    3- We will import :

    'use client'

import { Session } from "next-auth"
import {signIn} from 'next-auth/react'

    4- and create the export default function Nav without the  signin as we will be handling it from the server side in layout.tsx as this will allow to see that the user is connected as soon as we access the page. We will then pass it through the nav through "props"

    5- in layout.tsx we will add the <Nav/> tag in the body, add async in the export default tootlayout function and we import:
          - 
import Nav from './components/Nav'
import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

    6- We'll then fetch the user passing the user info from authOption into 

    const session = await getServerSession(authOptions)

    --->  we can see the console.log in the terminal

    7-  We need to pass the user into the Nav, For that we will call:
           - {user} : Session  in the Nav function in Nav.tsx
           - <Nav user={session?.user} expires={session?.expires as string} /> in layout.tsx
    
    8- Then we pass the user info(either they are signin or not) into our navbar in the Nav.tsx and add the icon image from the google login:

→button signin if user does not exist yet

→image if already signin

                {/* {Here we are checking if the user is not signed in} */}
        {!user && (
            <li>
                
                <button onClick={() => signIn()}>Sign In</button>
            </li>
        )
}
        {/* {Here we are checking if the user is signed in} */}

        {user && (
            <li>
                <Image src={user?.image as string } width={48} height={48} alt={user.name as string} />
            </li>
        )
        }

    </ul>

9- we also need to update next.config.js with the url
                /** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com']
  }
}

module.exports = nextConfig

10- Then we can style the image rounding up and styling the signin button hence we need to signout first from the app

IV. Add Admin/User Role


V. Fetch the data from Stripe (previously we created in the Stripe app a list of products)

          -  we first add the server side of Stripe via the command:

          yarn add @stripe/stripe-js@1.46.0

          Then we add  “files.stripes.com” in next.config.js

                            Back in dashboard on Stripe we will create some products adding some pics taken from pexels or unsplash

                            —> In the home page we will then be fetching the products from Stripe and set the info we want to pull from a new function getProduct that will then be called back in our render function Home()

- we first import Stripe then we create a new asynchroneous function to get the prducts 




VI. Styling home page
                 <!-- This allow us to create a grid template for the listing with the fluid function -->
                  -> In tailwind.config --
                     extend: {
      gridTemplateColumns: {
        fluid: "repeat(auto-fill, minmax(12rem, 1fr))",
    },

                   -> then in product we can add

                   <main className="grid grid-cols-fluid gap 16">

                   -> In Product now we need to resize the images using a className in <Image/>

VII. Product Page

  - We want to link our productsList to a Product description page(ProductCard).

  -    Hence we need to import Link in the Product file then wrap the product info into the <Link> tag
              <!-- <Link href=`/product/${id}`> --> for testing the routing
              <!-- <Link href={{pathname: `/product/${id}`, query: {name, image,price, description, id}}}> --> Once we know it works

  -    Then in order to link to the actual product we need to add the id in the product type and  product file:

  -    Then Under APP folder We create a product folder and a [id] folder and We will then create a page.tsx folder in the [id] folder

  For Testing We will add the below:
<!-- 
  export default async function Product (props) {
    console.log(props)
    return (
        <div>
            <div>

            <h1>Product</h1>
            <h2>Description</h2>
            </div>
         </div>   
    )
} -->

Once we get it wsorking and we can see the params in the terminal and the productPage in the browser we can paste the below 
  <!-- export default async function ProductCard({searchParams}) {
   
    return (
        <div className="flex justify-between gap-24 p-12 text-gray-700">
            {/* <Image 
            src={searchParams.image} 
            width={800} 
            height={800} 
            alt={searchParams.name}  
             /> */}
            <div>

            <h1>{searchParams.name}</h1>
            <p>description</p>
        </div>
            </div>
    )
} -->
    
    

    VIII. State Managment With Zustand

         Install zustand: yarn add zustand@4.3.3
             --> We create a file in the root of the app called store.ts
             --> we import:

                        import { create } from "zustand";
                        import { persist } from "zustand/middleware"; <-- import persist all the data in your local storage 

                        we now set the type of data we want and we set the setter. 

            --> To set the getter we will create a new component in the component folder called Cart.tsx

                                        'use client';

                                          import Image from "next/image";
                                          import { useCartStore } from "@/store";

                                          export default function Cart() {
                                              const carStore = useCartStore();
                                              console.log(carStore.isOpen)
                                              return (
                                                  <div>
                                                      <h1>Cart</h1>
                                                  </div>
                                              )
                                              
                                          }

            --> Then  In Nav.tsx we will:

- import Cart  and { useCartStore }
- we will add a const named cartStore to store the useCartStore()   in the NAv function.

Then we will add {cartStore.isOpen && <*Cart* />} before  the </Nav> tag

                      --> Then we install react-icons yarn add react-icons in order to install the icon on the page

                      —> Then we import the cart we want (we can select it from the react-icon docs:



Here we want AiFillShopping

IX. Adding Products to Cart

          --> In the store.ts we want to add toggleCart
          --> Nav.tsx add onClick={() =>cartStore.toggleCart() } in the shoppingIcon <li>


X. Hydration -mismatch Error - client-server
    REsolution: 
    - create a component called hydrate.tsx
    -  add 'use client' and import ReactNode,useEffect, useState from react
    -  Then we create an hydrate function where we will pass the children that act as a wrapper of our code:

<!-- 'use client'

import exp from "constants"
import { ReactNode,useEffect, useState } from "react"

// "children act as a wrapper around the code to avoid any hydration error"
export default function Hydrate({children} : {children: ReactNode}) {
    const [isHydrated, setHydrated] = useState(false)

    // Wait till next.js rehydration complete
    useEffect(() => {
        setHydrated(true)
    }, [])

    return(
        // We then retun a fragment if hydrated is true, 
        // then renderout all the children Otherwise renderout a <div> 
        // we wre still loading
    <> 
    isHydrated ? <> children </> : <div>Loading...</div>
    </>
    )
} -->
        Then we go to  Layout.tsx: