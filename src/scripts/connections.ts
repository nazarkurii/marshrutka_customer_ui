import router from '@/router'
import { useCookies } from 'vue3-cookies'
import type {
  UnloggedinParcelSelectionAttempt,
  UnloggedinTicketSelectionAttemt,
} from './authentication'
import type { ParcelCookies } from '@/stores/parcel'

export interface FindConnectionsRequest {
  from: string // UUID as string
  to: string // UUID as string
  date: string // ISO date string
  adults: number
  children: number
  infants: number
  range: number
}

export interface FindConnectionsResponse {
  connections: FoundConnection[]
  leftRange: ConnectionsRange[]
  rightRange: ConnectionsRange[]
}

export interface FoundConnection extends ConnectionSimplified {
  ticketsLeft: number
  fits: boolean
  available: boolean
}

export interface ConnectionSimplified {
  id: string // UUID as string
  price: number
  line: number
  departureCountry: string
  destinationCountry: string
  departureTime: string // ISO date string
  arrivalTime: string // ISO date string
  estimatedDuration: number
  sellBefore: string
}

export interface ConnectionParcel extends ConnectionSimplified {
  luggageVolumeLeft: number
  maxWidth: number
  maxHeight: number
  maxLength: number
  minimalParcelPrice: number
  parcelPricePerTenCm: number
  usable: boolean
  dayNumber: number
  dayMonth: number
  isCurrentMonth: boolean
}

export interface ConnectionsRange {
  date: string // ISO date string
  available: boolean
  number: number | undefined
  minPrice: number | undefined
}

export const emptyFindConnectionsResponse: FindConnectionsResponse = {
  connections: [],
  leftRange: [],
  rightRange: [],
}

export interface ResponseSeat {
  id: string // UUID as string
  number: number
  type: SeatType
  direction: SeatDirection
  taken: boolean
}

export function findFirstAvailableSeats(layout: ResponseSeat[][], number: number): string[] {
  const seats = []
  for (const row of layout) {
    for (const seat of row) {
      if (!seat.taken && seat.type != SeatType.Table && seat.type != SeatType.Space) {
        seats.push(seat.id)
        if (seats.length == number) {
          return seats
        }
      }
    }
  }
  return seats
}

export interface CustomerBus {
  model: string
  imageURLs: string[] // image URLs
  registrationNumber: string
  year: number
  structure: ResponseSeat[][] // 2D array representing bus layout
}

export interface Stop {
  id: string
  ticketId: string
  connectionId: string
  type: 'Pick-up' | 'Drop-off'
  updates: StopUpdate[]
}

export interface StopUpdate {
  stopId: string
  status: 'Confirmed' | 'Missed' | 'Completed'
  comment: string
  createdAt: string // ISO date string
}

export interface ConnectionFull extends ConnectionSimplified {
  googleMapsConnectionURL: string
  luggageVolumeLeft: number
  bus: CustomerBus
  stops: Stop[]
  backpackPrice: number
  smallLuggagePrice: number
  largeLuggagePrice: number
  minimalParcelPrice: number
  parcelPricePerTenCm: number
}

export const connectionFullTemplate: ConnectionFull = {
  id: '',
  price: 0,
  line: 0,
  departureCountry: '',
  destinationCountry: '',
  departureTime: '', // ISO string
  arrivalTime: '', // ISO string
  estimatedDuration: 0,
  googleMapsConnectionURL: '',
  luggageVolumeLeft: 0,
  sellBefore: '',
  bus: {
    model: '',
    imageURLs: [],
    registrationNumber: '',
    year: 0,
    structure: [],
  },
  stops: [],
  backpackPrice: 0,
  smallLuggagePrice: 0,
  largeLuggagePrice: 0,
  minimalParcelPrice: 0,
  parcelPricePerTenCm: 0,
}

export type SeatType =
  | 'Single'
  | 'Single-Window'
  | 'Window'
  | 'Aisle'
  | 'Middle'
  | 'Error'
  | 'Space'
  | 'Table'

export const SeatType = {
  Single: 'Single' as SeatType,
  SingleWindow: 'Single-Window' as SeatType,
  Window: 'Window' as SeatType,
  Aisle: 'Aisle' as SeatType,
  Middle: 'Middle' as SeatType,
  Space: 'Space' as SeatType,
  Table: 'Table' as SeatType,
}

export function isSeat(type: string): boolean {
  return type != SeatType.Space && type != SeatType.Table
}

// SeatDirection
export type SeatDirection = 'Forward' | 'Backward' | 'Error'

export const SeatDirection = {
  Forward: 'Forward' as SeatDirection,
  Backward: 'Backward' as SeatDirection,
  Error: 'Error' as SeatDirection,
}

export function unloggedinTicketSelect(
  id: string,
  adults: number,
  teenagers: number,
  children: number,
) {
  const { cookies } = useCookies()
  const details: UnloggedinTicketSelectionAttemt = {
    connectionID: id,
    adults: adults,
    teenagers: teenagers,
    children: children,
  }
  cookies.set('unloggedinTicketSelectionAttemt', JSON.stringify(details), '10min')

  router.push({ name: 'login' })
}

export function unloggedinParcelSelect(
  id: string,
  width: number,
  length: number,
  height: number,
  weight: number,
  packagetype: string,
) {
  const { cookies } = useCookies()
  const details: UnloggedinParcelSelectionAttempt = {
    connectionID: id,
    width: width,
    length: length,
    height: height,
    weight: weight,
    type: packagetype as 'package' | 'documents',
  }
  cookies.set('UnloggedinParcelSelectionAttempt', JSON.stringify(details), '10min')

  router.push({ name: 'login' })
}
