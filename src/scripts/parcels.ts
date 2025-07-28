import type { ConnectionFull, ConnectionSimplified } from './connections'

export interface CustomerParcel {
  parcel: Parcel
  connection: ConnectionFull
}

export interface Parcel {
  width: number
  height: number
  length: number
  qrCode?: string
  price: number
  weight: number
  type: string
}
