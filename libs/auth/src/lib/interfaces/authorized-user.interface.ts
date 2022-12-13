export interface AuthorizedUser {
    refreshToken: string
    accessToken: string
    userId: string
    expiresAt: number
}
