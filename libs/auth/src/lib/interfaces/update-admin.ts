import { RoleEnum } from '../enums/role.enum'

export interface UpdateUser {
    password?: string
    role: RoleEnum
}
