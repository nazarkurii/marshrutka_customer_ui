
import { adressTemplate, type Adress } from '@/scripts/adresses'
import {
  connectionFullTemplate,
  isSeat,
  SeatType,
  type ConnectionFull,
  type ConnectionParcel,
  type ConnectionSimplified,
  type ResponseSeat,
} from '@/scripts/connections'
import { Problem } from '@/scripts/errors'
import type { Passenger } from '@/scripts/passengers'
import type { Link } from '@/scripts/request'

import axios from 'axios'

import { defineStore } from 'pinia'

import { watch } from 'vue'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { useCookies } from 'vue3-cookies'

export const useParcelStore = defineStore('parcel', {
  state: () => ({
    type: <'package' | 'documents'>'package',
    width: 20,
    height: 20,
    length: 20,
    weight: 20000,
    response: {
      connections: <ConnectionParcel[]>[],
      year: 0,
      month: 0,
    },
    reqesting: false,
    pickUpAddress: JSON.parse(JSON.stringify(adressTemplate)) as Adress,
    dropOffAddress: JSON.parse(JSON.stringify(adressTemplate)) as Adress,
    connection: connectionFullTemplate,
    calendarError: false,

    widthError: false,
    heightError: false,
    lngthError: false,

    retry: false,
    senderFirstName: '',
    senderLastName: '',
    recieverFirstName: '',
    recieverLastName: '',
    senderEmail: '',
    senderPhoneNumber: '',
    recieverEmail: '',
    recieverPhoneNumber: '',
    firstTry: true,
    pickUpAdress: adressTemplate,
    dropOffAdress: adressTemplate,
    policyAccepted: false,
    errors: {
      recieverInfo: {
        firstName: false,
        lastName: false,
        email: false,
        phoneNumber: false,
      },
      senderInfo: {
        firstName: false,
        lastName: false,
        email: false,
        phoneNumber: false,
      },
      notEnoughSpaceAlready: false,
    },
  }),

  getters: {
    volume(state) {
      return state.width * state.height * state.length
    },

    purchaseValidation(state) {
      return (
        state.recieverFirstName.length &&
        state.recieverLastName.length &&
        state.recieverEmail.length &&
        state.recieverPhoneNumber.length &&
        state.senderFirstName.length &&
        state.senderLastName.length &&
        state.senderEmail.length &&
        state.senderPhoneNumber.length &&
        state.pickUpAddress.city.length &&
        state.pickUpAddress.street.length &&
        state.pickUpAddress.houseNumber.length &&
        state.dropOffAddress.city.length &&
        state.dropOffAddress.street.length &&
        state.dropOffAddress.houseNumber.length &&
        state.policyAccepted &&
        !state.errors.notEnoughSpaceAlready &&
        !state.errors.recieverInfo.email &&
        !state.errors.recieverInfo.phoneNumber &&
        !state.errors.recieverInfo.firstName &&
        !state.errors.recieverInfo.lastName &&
        !state.errors.senderInfo.email &&
        !state.errors.senderInfo.phoneNumber &&
        !state.errors.senderInfo.firstName &&
        !state.errors.senderInfo.lastName
      )
    },

    validation(state) {
      return {
        width: isNaN(Number(state.width)) || state.width < 10 || state.width > 1000,
        height: isNaN(Number(state.height)) || state.height < 10 || state.height > 1000,
        length: isNaN(Number(state.length)) || state.length < 10 || state.length > 1000,
        weight: isNaN(Number(state.weight)) || state.weight < 1000 || state.weight > 50000,
      }
    },

    price(state) {
      return state.connection.price
    },
  },
  actions: {
    chooseDocuments() {
      this.type = 'documents'
      this.width = 40
      this.height = 10
      this.length = 10
      this.weight = 2000
    },
    choosePackage() {
      this.type = 'package'
      this.width = 20
      this.height = 20
      this.length = 20
      this.weight = 20000
    },
    async search(from: string, to: string, year: number, month: number) {
      try {
        this.reqesting = true
        const {
          data,
        }: {
          data: {
            connections: ConnectionParcel[]
            links: { [key: number]: Link }
          }
        } = await axios.get(
          import.meta.env.VITE_API_URL +
            `/connection/available-parcel-dates/${from}/${to}/${year}/${month}/${this.width}/${this.height}/${this.length}`,
        )

        this.response.year = Number(year)
        this.response.month = Number(month)
        this.response.connections = [...data.connections]
    
      } catch (err) {
        const problem = new Problem(err)
        if (problem.type.endsWith('calendar-unavailable-yet')) {
          this.calendarError = true
        }
      } finally {
        setTimeout(() => {
          this.reqesting = false
        }, 300)
      }
    },
    async getConnection(connectionID: string) {
      try {
        const { data }: { data: { connection: ConnectionFull } } = await axios.get(
          `/connection-parcel/${connectionID}/${this.width}/${this.height}/${this.length}` ,
        )
        var seatsLeft = 0
        data.connection.bus.structure.map((row) => {
          row.map((seat) => {
            if (!seat.taken && isSeat(seat.type)) {
              seatsLeft++
            }
          })
        })

       
        Object.assign(this.connection, data.connection)
        this.pickUpAddress.country = data.connection.departureCountry
        this.dropOffAddress.country = data.connection.destinationCountry
        
      } catch (err) {
        new Problem(err)
      }
    },

    init(route: RouteLocationNormalizedLoadedGeneric) {
      this.$reset()
      this.width = Number(route.params.width)
      this.height = Number(route.params.height)
      this.length = Number(route.params.length)
      this.retry = route.params.retry == 'true'
      this.weight = Number(route.params.weight)
      this.type = String(route.params.type) as 'documents' | 'package'
    },

    setCookies() {
      const { cookies } = useCookies()
      cookies.set(
        'parcelForm',
        JSON.stringify({
          connectionID: this.connection.id,
          senderFirstName: this.senderFirstName,
          senderLastName: this.senderLastName,
          recieverFirstName: this.recieverFirstName,
          recieverLastName: this.recieverLastName,
          senderEmail: this.senderEmail,
          senderPhoneNumber: this.senderPhoneNumber,
          recieverEmail: this.recieverEmail,
          recieverPhoneNumber: this.recieverPhoneNumber,
          width: this.width,
          length: this.length,
          height: this.height,
          type:this.type,
          weight: this.weight
        }),
      )
    },

    getCookies() {
      const { cookies } = useCookies()
      const parcelCookies = cookies.get('parcelForm') as ParcelCookies | null
      if (parcelCookies) {
        if (parcelCookies.connectionID == this.connection.id) {
          this.senderFirstName = parcelCookies.senderFirstName
          this.senderLastName = parcelCookies.senderLastName
          this.recieverFirstName = parcelCookies.recieverFirstName
          this.recieverLastName = parcelCookies.recieverLastName
          this.senderEmail = parcelCookies.senderEmail
          this.senderPhoneNumber = parcelCookies.senderPhoneNumber
          this.recieverEmail = parcelCookies.recieverEmail
          this.recieverPhoneNumber = parcelCookies.recieverPhoneNumber
        }
      }
    },

    async purchase() {
      this.setCookies()
      this.firstTry = false
      if (!this.purchaseValidation) return

      this.reqesting = true
      try {
        const { data }: { data: { links: { redirect: Link } } } = await axios.post(
          `/connection/${this.connection.id}/purchase-parcel`,
          {
            recieverFirstName: this.recieverFirstName,
            recieverLastName: this.recieverLastName,
            senderFirstName: this.senderFirstName,
            senderLastName: this.senderLastName,
            recieverEmail: this.recieverEmail,
            recieverPhoneNumber: this.recieverPhoneNumber,
            senderEmail: this.senderEmail,
            senderPhoneNumber: this.senderPhoneNumber,
            dropOffAdress: {
              city: this.dropOffAddress.city,
              street: this.dropOffAddress.street,
              houseNumber: this.dropOffAddress.houseNumber,
              apartmentNumber: this.dropOffAddress.apartmentNumber,
              googleMapsID: this.dropOffAddress.googleMapsID,
              formatedAdress: this.dropOffAddress.formated,
            },
            pickUpAdress: {
              city: this.pickUpAddress.city,
              street: this.pickUpAddress.street,
              houseNumber: this.pickUpAddress.houseNumber,
              apartmentNumber: this.pickUpAddress.apartmentNumber,
              googleMapsID: this.pickUpAddress.googleMapsID,
              formatedAdress: this.pickUpAddress.formated,
            },
            connectionID: this.connection.id,
            width: this.width,
            length: this.length,
            height: this.height,
            type: this.type,
            weight: this.weight,
          },
        )
        window.location.href = data.links.redirect.href
      } catch (err) {
        const problem = new Problem(err)
        if (problem.status == 409) {
          this.errors.notEnoughSpaceAlready = true
        } else if (problem.invalidParams) {
          problem.ifStatus(400, () => {
            if (problem.invalidParams) {
              this.errors.recieverInfo.email =
                problem.invalidParams.findIndex((value) => value.name == 'recieverEmail') != -1
              this.errors.recieverInfo.phoneNumber =
                problem.invalidParams.findIndex((value) => value.name == 'recieverPhoneNumber') !=
                -1
              this.errors.recieverInfo.firstName =
                problem.invalidParams.findIndex((value) => value.name == 'recieverFirstName') != -1
              this.errors.recieverInfo.lastName =
                problem.invalidParams.findIndex((value) => value.name == 'recieverLastName') != -1

              this.errors.senderInfo.email =
                problem.invalidParams.findIndex((value) => value.name == 'senderEmail') != -1
              this.errors.senderInfo.phoneNumber =
                problem.invalidParams.findIndex((value) => value.name == 'senderPhoneNumber') != -1
              this.errors.senderInfo.firstName =
                problem.invalidParams.findIndex((value) => value.name == 'senderFirstName') != -1
              this.errors.senderInfo.lastName =
                problem.invalidParams.findIndex((value) => value.name == 'senderLastName') != -1
            }
          })
        }
        this.reqesting = false
      } finally {
        this.reqesting = false
      }
    },
  },
})

export interface ParcelCookies {
  connectionID: string
  senderFirstName: string
  senderLastName: string
  recieverFirstName: string
  recieverLastName: string
  senderEmail: string
  senderPhoneNumber: string
  recieverEmail: string
  recieverPhoneNumber: string
  width: number
  height: number
  length: number
  type: string
  weight: number
}
