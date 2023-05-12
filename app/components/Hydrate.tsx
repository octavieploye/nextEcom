'use client'

// import exp from "constants"
import { ReactNode,useEffect, useState } from "react"
import { useThemeStore } from "@/store"

// "children act as a wrapper around the code to avoid any hydration error"
export default function Hydrate({children} : {children: ReactNode}) {
    const [isHydrated, setHydrated] = useState(false)
    const themeStore = useThemeStore()

    // Wait till next.js rehydration complete
    useEffect(() => {
        setHydrated(true)
    }, [])

    return(
        // We then retun a fragment if hydrated is true, 
        // then renderout all the children Otherwise renderout a <div> 
        // we wre still loading
    <> 
    {isHydrated ? <body data-theme={themeStore.mode}> {children} </body> : <body></body>}
    </>
    )
}