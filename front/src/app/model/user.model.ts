

export interface ApiUser {
    users_id: number
    users_lastName: string
    users_firstName: string
    users_pwd: string
    users_mail: string
    users_birthday: any
    users_isAdmin : number
}

export interface AuthResult {
    token: string
    status: number
    user: ApiUser
}

export class User {
    id: number
    lastName: string
    firstName: string
    email: string
    password: string
    birthday: any
    isAdmin : number

    constructor(id: number, lastName?: string, firstName?: string, email?: string, password?: string, birthday?: any, isAdmin?: number) {
        this.id = id
        this.lastName = lastName
        this.firstName = firstName
        this.email = email
        this.password = password
        this.birthday = birthday
        this.isAdmin = isAdmin
    }

    getApiData(): ApiUser {
        return {
            users_id: this.id,
            users_lastName: this.lastName,
            users_firstName: this.firstName,
            users_pwd: this.password,
            users_mail: this.email,
            users_birthday: this.birthday,
            users_isAdmin: this.isAdmin
        }
    }
}