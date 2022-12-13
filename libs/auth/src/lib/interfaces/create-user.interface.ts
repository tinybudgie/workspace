import { RoleEnum } from '../enums/role.enum'

export interface CreateUser {
    login: string
    password: string
    name: string
    role: RoleEnum
}
