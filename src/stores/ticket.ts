import router from '@/router'
import { adressTemplate, type Adress } from '@/scripts/adresses'
import {
  connectionFullTemplate,
  isSeat,
  SeatType,
  type ConnectionFull,
  type ResponseSeat,
} from '@/scripts/connections'
import { Problem } from '@/scripts/errors'
import type { Passenger } from '@/scripts/passengers'
import type { Link } from '@/scripts/request'
import axios from 'axios'
import { defineStore } from 'pinia'
import { watch } from 'vue'
import { useCookies } from 'vue3-cookies'

export const useTicketStore = defineStore('ticket', {
  state: () =>
    <Ticket>{
      connection: connectionFullTemplate,
      seats: [],
      passengers: [],
      pickUpAddress: JSON.parse(JSON.stringify(adressTemplate)),
      dropOffAddress: JSON.parse(JSON.stringify(adressTemplate)),
      email: '',
      phoneNumber: '',
      requesting: false,
      firstTry: true,
      policyAccepted: false,
      violations: {
        email: false,
        seats: false,
        passengers: false,
        pickUpAdress: false,
        dropOffAdress: false,
        phoneNumber: false,
      },
      alreadyUnavailableError: false,
      tooManyPassengersError: false,
      takenSeatsError: false,
      emailError: false,
      phoneNumberError: false,
      retry: false,
      backPacks: 0,
      smallLuggage: 0,
      largeLuggage: 0,
    },

  getters: {
    price(state) {
      const tickets = state.connection.price * state.passengers.length

      const backpacks =
        (state.passengers.length >= state.backPacks
          ? 0
          : state.backPacks - state.passengers.length) * state.connection.backpackPrice
      const smallLuggage = state.smallLuggage * state.connection.smallLuggagePrice
      const largeLuggage =
        (state.passengers.length >= state.largeLuggage
          ? 0
          : state.largeLuggage - state.passengers.length) * state.connection.largeLuggagePrice
      return ((tickets + backpacks + smallLuggage + largeLuggage) / 100).toFixed(2)
    },
    luggageVolume(state) {
      return state.backPacks * 24000 + state.smallLuggage * 60000 + state.largeLuggage * 200000
    },

    allValid(state) {
      // Check passengers
      const passengersValid = state.passengers.every(
        (passenger) => passenger.firstName !== '' && passenger.lastName !== '',
      )

      // Check contact info
      const contactInfo = state.email.length >= 6 && state.phoneNumber.length > 4

      // Check drop-off address
      const dropOffAddress =
        state.dropOffAddress.country !== '' &&
        state.dropOffAddress.city !== '' &&
        state.dropOffAddress.street !== '' &&
        state.dropOffAddress.houseNumber !== ''

      // Check pick-up address
      const pickUpAddress =
        state.pickUpAddress.country !== '' &&
        state.pickUpAddress.city !== '' &&
        state.pickUpAddress.street !== '' &&
        state.pickUpAddress.houseNumber !== ''

      // Return true only if all validations pass
      return (
        passengersValid && contactInfo && dropOffAddress && pickUpAddress && state.policyAccepted
      )
    },

    passengersValid(state) {
      var validation: {
        index: number
        firstName: boolean
        lastName: boolean
      }[] = []

      state.passengers.map((passenger, i) => {
        validation.push({
          index: i,
          firstName: passenger.firstName != '',
          lastName: passenger.lastName != '',
        })
      })

      return validation
    },

    contactInfoValid(state) {
      return {
        email: state.email.length >= 6,
        phoneNumber: state.phoneNumber.length > 4,
      }
    },

    dropOffAdressValid(state) {
      return {
        country: state.dropOffAddress.country != '',
        city: state.dropOffAddress.city != '',
        street: state.dropOffAddress.street != '',
        houseNumber: state.dropOffAddress.houseNumber != '',
      }
    },
    pickUpAdressValid(state) {
      return {
        country: state.pickUpAddress.country != '',
        city: state.pickUpAddress.city != '',
        street: state.pickUpAddress.street != '',
        houseNumber: state.pickUpAddress.houseNumber != '',
      }
    },
  },

  actions: {
    selectSeat(seatToSelect: ResponseSeat) {
      if (this.seats.length == this.passengers.length) {
        this.seats.shift()
      }

      this.seats.push(seatToSelect)
    },
    unselectSeat(seatToUnselect: ResponseSeat) {
      this.seats.splice(
        this.seats.findIndex((seat) => seat.id == seatToUnselect.id),
        1,
      )
    },

    async purchase() {
      this.firstTry = false
      if (!this.allValid) {
        return
      }
      const { cookies } = useCookies()
      cookies.set('ticketForm', JSON.stringify(this.$state))

      this.requesting = true
      try {
        const { data }: { data: { links: { redirect: Link } } } = await axios.post(
          `/connection/purchase-ticket`,
          {
            connectionId: this.connection.id,
            seatIDs: this.seats.map((seat) => seat.id),
            passengers: this.passengers.map((passenger) => ({
              firstName: passenger.firstName,
              lastName: passenger.lastName,
            })),
            dropOffAdress: this.dropOffAddress,
            pickUpAdress: this.pickUpAddress,
            email: this.email,
            phoneNumber: this.phoneNumber,
            backpacks: this.backPacks,
            smallLuggage: this.smallLuggage,
            largeLuggage: this.largeLuggage,
          },
        )

        window.location.href = data.links.redirect.href
        this.requesting = false
      } catch (err) {
        const problem = new Problem(err)

        problem.ifStatus(409, () => {
          if (problem.invalidParams?.findIndex((param) => param.name == 'phoneNumber')) {
            this.violations.phoneNumber = true
          }

          if (problem.invalidParams?.findIndex((param) => param.name == 'email')) {
            this.violations.email = true
          }
          if (problem.title == 'Available Seats Error') {
            this.alreadyUnavailableError = true
          } else if (problem.title == 'Taken Seat Error') {
            this.getConnection(this.connection.id, this.passengers.length)

            this.takenSeatsError = true
            this.requesting = false
          }
        })
      } finally {
        this.requesting = false
      }
    },
    async getConnection(connectionID: string, totalPassengers: number): Promise<boolean> {
      try {
        const { data }: { data: { connection: ConnectionFull } } = await axios.get(
          '/connection/' + connectionID + '?passengers=' + totalPassengers,
        )

        Object.assign(this.connection, data.connection)

        this.pickUpAddress.country = data.connection.departureCountry
        this.dropOffAddress.country = data.connection.destinationCountry
        this.fixSeats()
        return false
      } catch (err) {
        const problem = new Problem(err)
        if (problem.type.endsWith('too-big-passengers-number')) {
          this.tooManyPassengersError = true
          this.retry = false
        }

        return true
      }
    },

    fixSeats(sameConnection = false, savedSeats: ResponseSeat[] = []) {
      const ticketFormSeats = [...savedSeats]
      this.seats = []

      const assignSeat = (seat: ResponseSeat) => {
        if (
          !seat.taken &&
          seat.type !== SeatType.Space &&
          seat.type !== SeatType.Table &&
          !this.seats.includes(seat)
        ) {
          this.seats.push(seat)
          const index = ticketFormSeats.findIndex((s) => s.id === seat.id)
          if (index !== -1) ticketFormSeats.splice(index, 1)
          return true
        }
        return false
      }

      const findAvailableSeat = () => {
        for (const row of this.connection.bus.structure)
          for (const seat of row)
            if (this.seats.length < this.passengers.length && assignSeat(seat)) return
      }

      for (const passenger of this.passengers) {
        if (ticketFormSeats.length && sameConnection) {
          const seatToTry = ticketFormSeats.shift()!
          const found = this.connection.bus.structure.some((row) =>
            row.some((s) => s.id === seatToTry.id && assignSeat(s)),
          )
          if (!found) findAvailableSeat()
        } else {
          findAvailableSeat()
        }
      }
    },
  },
})

export interface Ticket extends NewTicket {
  violations: {
    email: boolean
    seats: boolean
    passengers: boolean
    pickUpAdress: boolean
    dropOffAdress: boolean
    phoneNumber: boolean
  }
  email: string
  phoneNumber: string
  firstTry: boolean
  requesting: boolean
  policyAccepted: boolean
  alreadyUnavailableError: boolean
  takenSeatsError: boolean
  tooManyPassengersError: boolean
  emailError: false
  phoneNumberError: false
  retry: boolean
  backPacks: number
  smallLuggage: number
  largeLuggage: number
}

export interface NewTicket {
  connection: ConnectionFull
  seats: ResponseSeat[]
  passengers: Passenger[]
  pickUpAddress: Adress
  dropOffAddress: Adress
}
