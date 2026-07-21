import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: env.BETTER_AUTH_URL
})