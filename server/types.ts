import { type IResult } from "sendgrid"
import type { Either, Maybe } from "./utils/tools.ts"

export type Imp = {
  readFile: (path: string) => Promise<Maybe<Uint8Array>>
  createUser: (user: User) => Promise<Either<Error, void>>
  readUser: (fields: string | Partial<User>) => Promise<User | undefined>
  readUsers: (fields: Partial<User>) => Promise<User[]>
  updateUser: (username: string, userDetails: Partial<User>) => Promise<Either<Error, void>>
  deleteUser: (username: string) => Promise<Either<Error, void>>
  sendVerifyEmail: (user: User) => Promise<IResult>
  sendCredentialsEmail: (user: User) => Promise<IResult>
}

export type RequestParams = {
  method: string
  url: URL
  sections: [string, ...string[]]
  page: string
  formData?: FormData
  user?: User
}

export type Session = {
  username: string
  key: string
}

export type User = {
  username: string
  email: string
  emailConfirmed: boolean
  password: string
  lastLoginDate: string | null
  token: string
  tokenExpires: string
  firstName: string
  lastName: string
  schoolName: string | null
  schoolPostcode: string | null
  guardian: string | null
  admin: boolean
  receivingEmails: boolean
  systemSettings: string | null
}
