export interface User {
  id: string // UUID
  firstName: string
  lastName: string
  dateOfBirth: string // ISO date string (e.g., "2006-01-02T15:04:05Z")
  phoneNumber: string
  email: string
  password: string
  imageUrl: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export const userTemplate: User = {
  id: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  phoneNumber: '',
  email: '',
  password: '',
  imageUrl: '',
  createdAt: '',
  updatedAt: '',
  deletedAt: null,
}
