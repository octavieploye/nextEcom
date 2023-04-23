// *This is the main page of our app.
// *Here we will render the list of products we have in our Stripe account.

import Stripe from "stripe"
import Product from "./components/Product"

// This function will be called at build time
const  getProducts = async () => {
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion:"2022-11-15",})        
        // We can use the Stripe object to get a list of products with the data we need. 
        // To render our page we will create a new component called ProductCard.jsx
          const products = await stripe.products.list()

          const productWithPrices = await Promise.all(
                      products.data.map(async (product) => {
                      const prices = await stripe.prices.list({product: product.id,})
                      const features = product.metadata.features || "" // we use here the metadata to get the features of the product
                      return {
                        id: product.id,
                        name: product.name,
                        unit_amount: prices.data[0].unit_amount,  // we use here the unit_amount to get the price of the product
                        image: product.images[0],
                        currency: prices.data[0].currency,
                        description: product.description,
                        metadata: {  features },
                          
                      }
                })
              )
          return productWithPrices
         
          }
          
          export default async function Home() {
            const products = await getProducts()
            console.log(products)
            return (
              
              //  we use here the tailwind css grid we set in the tailwind.config file 
              // to render the products in a grid layout
              <main className="grid grid-cols-fluid gap-12 p-10 mx-10 bg-base-300 rounded-lg" >
                          {/* <h1 className="text-4xl p-2" >Hello from next ecommerce web app. Here is my product List:  🚀</h1> */}
                          
                                  {products.map((product) => (
                                    // Here we added the return() statement to render the ProductCard component(). Check below link for more info
                                    <Product {...product} key={product.id} />
                                    
                                    ))}
                            
                        </main>
                                        
                                        )
                                      }
                                      
                                      