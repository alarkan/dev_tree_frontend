export type User = {
    name: string
    handle: string
    email: string
    password: string
    id_: string
    description: string
    image: string
    links: string
}

export type RegisterForm = Pick<User, 'name' | 'handle' | 'email'> & {
    password: string
    password_confirmation: string
}

export type LoginForm = Pick<User, 'email' | 'password'> & {
    password: string
}

export type ProfileForm = Pick<User, 'handle' | 'description'>

export type SocialNetwork = {
    id: number
    name: string
    url: string
    enabled: boolean
}

export type DevTreeLink = Pick<SocialNetwork, 'name' | 'url' | 'enabled'> 

export type UserHandle = Pick<User, 'handle' | 'image' | 'description' | 'links' | 'name'>