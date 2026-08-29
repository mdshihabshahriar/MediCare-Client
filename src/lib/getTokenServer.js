import { headers } from "next/headers"
import { auth } from "./auth"

export const getTokenServer = async () => { 
    const {token} = await auth.api.getToken({
        headers: await headers()
    })

    return token || null
}