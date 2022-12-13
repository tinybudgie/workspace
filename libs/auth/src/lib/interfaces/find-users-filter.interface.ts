export interface FindUsersFilter {
    skip?: number
    take?: number
    where?: FindFields
}

interface FindFields {
    name?: string
    login?: string
}
