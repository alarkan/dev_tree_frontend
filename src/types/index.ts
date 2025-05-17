export type User = {
    name: string
    handle: string
    email: string
    password: string
    id_: string
    description: string
    image: string
    tasks: string
}

export type RegisterForm = Pick<User, 'name' | 'handle' | 'email'> & {
    password: string
    password_confirmation: string
}

export type LoginForm = Pick<User, 'email' | 'password'> & {
    password: string
}

export type ProfileForm = Pick<User, 'handle' | 'description'>

export type Task = {
    id: number
    name: string
    task_description: string
    enabled: boolean
}

export type DevTreeTask = Pick<Task, 'name' | 'task_description' | 'enabled'> 

export type UserHandle = Pick<User, 'handle' | 'image' | 'description' | 'tasks' | 'name'>