export interface IUser {
  id: number
  username?: string
  last_name?: string
  first_name?: string
  access_hash: string
}

export interface IMessage {
  sender: IPeer
  text: string
}

export interface TG_IMessage {
  user_id: number
  id: number
  message: string
}

export interface IPeer {
  id: number
  user_id: number
  username?: string
  last_name?: string
  first_name?: string
}

export interface TG_IUser {
  user: {
    id: number
    username?: string
    last_name?: string
    first_name?: string
    access_hash: string
  }
}

export interface TG_IPeer {
  user: {
    id: number
    username?: string
    last_name?: string
    first_name?: string
    access_hash: string
  }
}

export interface GeoInfoRes {
  country: string
}

export interface SendCodeRes {
  phone_code_hash: string
}

export interface SignInRes {}
