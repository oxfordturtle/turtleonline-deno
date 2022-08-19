import type { Maybe } from "./utils/tools.ts"

export type Imp = {
  readFile: (path: string) => Promise<Maybe<Uint8Array>>
  createUser: (user: User) => Promise<boolean>
  readUser: (username: string) => Promise<User | undefined>
  updateUser: (username: string, userDetails: Partial<User>) => Promise<boolean>
  deleteUser: (username: string) => Promise<boolean>
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
  password: string
  firstName: string
  lastName: string
  accountType: 1 | 2
  guardian?: string
  schoolName?: string
  schoolPostcode?: string
  receivingEmails: boolean
}
