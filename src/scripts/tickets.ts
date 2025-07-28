import type { ConnectionSimplified, ResponseSeat } from './connections'

export interface CustomerTicket {
  ticket: Ticket
  connection: ConnectionSimplified
  expired: boolean
}

export interface Ticket {
  id: string // UUID
  userId: string // UUID
  connectionID: string // UUID
  seats: ResponseSeat[]
  phoneNumber: string
  email: string
  qrCode: string
  passengers: TicketPassenger[]
  pickUpAddress: TicketAddress
  dropOffAddress: TicketAddress
  createdAt: string // ISO date string
  completedAt: string // ISO date string
  ticketPayment: TicketPayment
  deletedAt?: string | null
}

export interface TicketPassenger {
  id: string // UUID
  firstName: string
  lastName: string
}

export interface TicketAddress {
  id: string // UUID
  country: Country
  city: string
  street: string
  houseNumber: string
  apartmentNumber?: string
  googleMapsLink: string
}

export interface Country {
  id: string // UUID
  name: string
}

export interface TicketPayment {
  ticketId: string // UUID
  price: number
  method: 'Card' | 'Cash' | string
  createdAt: string // ISO date string
  sessionID: string
}
