export interface IUser {
  user?: {
    user_id?: string
    username?: string
    last_name?: string
    first_name?: string
  }
}

export interface IMessage {
  user_id: string
  text: string
}
