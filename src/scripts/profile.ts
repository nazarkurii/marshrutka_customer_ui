export interface User {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  phoneNumber?: string
  email: string
  password: string
  createdAt: string
}

export const userTemplate: User = {
  id: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  phoneNumber: '',
  email: '',
  password: '',
  createdAt: '',
}
