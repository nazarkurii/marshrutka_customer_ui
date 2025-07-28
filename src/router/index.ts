import { useAppStore } from '@/stores/app'
import AboutView from '@/views/AboutView.vue'
import ConnectionsVIew from '@/views/ConnectionsVIew.vue'
import HomeView from '@/views/HomeView.vue'
import InternalServerErrorView from '@/views/InternalServerErrorView.vue'
import AuthenticationView from '@/views/AuthenticationView.vue'
import NewsView from '@/views/NewsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SupportView from '@/views/SupportView.vue'
import { createRouter, createWebHistory, type RouteRecordNameGeneric } from 'vue-router'
import LoginForm from '@/components/authentication/LoginForm.vue'
import SingUpForm from '@/components/authentication/singup/SingUpForm.vue'

import { useCookies } from 'vue3-cookies'

import EmailVerification from '@/components/authentication/singup/EmailVerification.vue'
import EmailForm from '@/components/authentication/singup/EmailForm.vue'

import General from '@/components/profile/General.vue'
import ForgotPassword from '@/components/authentication/ForgotPassword.vue'
import VerifyEmail from '@/components/authentication/forgot_password/VerifyEmail.vue'
import VerifyEmailCode from '@/components/authentication/forgot_password/VerifyEmailCode.vue'
import ChangePssword from '@/components/authentication/forgot_password/ChangePssword.vue'
import SearchResult from '@/components/connections/transport_search_result/SearchResult.vue'
import Connection from '@/components/connections/connection/Connection.vue'
import Tickets from '@/components/profile/Tickets.vue'
import Signup from '@/components/authentication/SignupPage.vue'
import { ref } from 'vue'
import type { NewTicket } from '@/stores/ticket'
import { unloggedinParcelSelect, unloggedinTicketSelect } from '@/scripts/connections'
import Transport from '@/components/connections/Transport.vue'
import Package from '@/components/connections/Parcel.vue'
import PackageOrderView from '@/views/ParcelOrderView.vue'
import ParcelSizeRedactor from '@/components/connections/parcel_search/ParcelSizeRedactor.vue'
import DateSelection from '@/components/connections/parcel_search/DateSelection.vue'
import ParcelOrderView from '@/views/ParcelOrderView.vue'
import Parcels from '@/components/profile/Parcels.vue'
import type { ParcelCookies } from '@/stores/parcel'
import PopularDestinations from '@/components/connections/transport_search/PopularDestinations.vue'
import { countryExists } from '@/scripts/countries'

const { cookies } = useCookies()
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      beforeEnter: (to, from, next) => {
        if (to.name == 'home') {
          next({ name: 'connections' })
        } else {
          next()
        }
      },
      name: 'home',
      component: HomeView,

      children: [
        {
          path: 'connections',
          name: 'connections',
          component: ConnectionsVIew,

          children: [
            {
              path: 'parcel',
              name: 'parcel',
              component: Package,
              children: [
                {
                  path: 'size',
                  name: 'parcelSize',
                  component: ParcelSizeRedactor,
                },

                {
                  path: 'date/:type/:from/:to/:width/:length/:height/:weight',
                  name: 'parcelDate',
                  component: DateSelection,
                  beforeEnter: (to, from, next) => {
                    if (
                      countryExists(String(to.params.from)) &&
                      countryExists(String(to.params.to))
                    ) {
                      if (to.params.type === 'documents') {
                        if (
                          to.params.width !== '20' ||
                          to.params.length !== '40' ||
                          to.params.height !== '20' ||
                          to.params.weight !== '2000'
                        ) {
                          next({
                            name: 'parcelDate',
                            params: {
                              type: 'documents',
                              from: to.params.from,
                              to: to.params.to,
                              width: '20',
                              length: '40',
                              height: '20',
                              weight: '2000',
                            },
                          })
                        } else {
                          next()
                        }
                      } else if (to.params.type === 'package') {
                        if (
                          Number(to.params.width) < 10 ||
                          Number(to.params.width) > 1000 ||
                          Number(to.params.length) < 10 ||
                          Number(to.params.length) > 1000 ||
                          Number(to.params.height) < 10 ||
                          Number(to.params.height) > 1000 ||
                          Number(to.params.weight) < 1000 ||
                          Number(to.params.weight) > 50000
                        ) {
                          next({ name: 'parcelSize' })
                        } else {
                          next()
                        }
                      } else {
                        next()
                      }
                    } else {
                      next({ name: 'popularDestinations' })
                    }
                  },
                },
              ],

              beforeEnter: (to, from, next) => {
                if (to.name == 'parcel') {
                  next({ name: 'parcelSize' })
                } else {
                  next()
                }
              },
            },
            {
              path: 'transport',
              name: 'transport',
              component: Transport,
              children: [
                {
                  path: 'popular-destinations',
                  name: 'popularDestinations',
                  component: PopularDestinations,
                },
                {
                  path: 'search/:from/:to/:date/:adults/:children/:teenagers',
                  name: 'connectionsResult',
                  component: SearchResult,
                  beforeEnter: (to, from, next) => {
                    if (
                      countryExists(String(to.params.from)) &&
                      countryExists(String(to.params.to)) &&
                      Number(to.params.adults) > 0 &&
                      !isNaN(Number(to.params.children)) &&
                      !isNaN(Number(to.params.teenagers))
                    ) {
                      next()
                    } else {
                      next({ name: 'popularDestinations' })
                    }
                  },
                },
              ],
              beforeEnter: (to, from, next) => {
                if (to.name == 'transport') {
                  next({ name: 'popularDestinations' })
                } else {
                  next()
                }
              },
            },
          ],
          beforeEnter: (to, from, next) => {
            const { cookies } = useCookies()
            cookies.remove('unloggedinTicketSelectionAttemt')
            cookies.remove('ticketForm')

            if (to.name == 'connections') {
              next({ name: 'transport' })
            } else {
              next()
            }
          },
        },

        {
          path: 'parcel/:connectionID/:type/:width/:length/:height/:weight/:retry',
          name: 'parcelOrder',
          component: ParcelOrderView,
          beforeEnter: (to, from, next) => {
            if (
              Number(to.params.width) < 10 ||
              Number(to.params.width) > 1000 ||
              Number(to.params.length) < 10 ||
              Number(to.params.length) > 1000 ||
              Number(to.params.height) < 10 ||
              Number(to.params.height) > 1000 ||
              Number(to.params.weight) < 1000 ||
              Number(to.params.weight) > 50000 ||
              (to.params.type != 'documents' && to.params.type != 'package') ||
              String(to.params.connectionID).length != 36 ||
              (String(to.params.retry) != 'true' && String(to.params.retry) != 'false')
            ) {
              next({ name: 'popularDestinations' })
            } else if (to.params.type == 'documents') {
              if (
                Number(to.params.width) != 40 ||
                Number(to.params.length) != 10 ||
                Number(to.params.height) != 10 ||
                Number(to.params.weight) != 2000
              ) {
                next({
                  name: 'parcelOrder',
                  params: {
                    connectionID: to.params.connectionID,
                    width: '40',
                    height: '10',
                    length: '10',
                    weight: '2000',
                    type: 'documents',
                    retry: 'false',
                  },
                })
              }
              const app = useAppStore()
              if (!app.loggedIn) {
                unloggedinParcelSelect(
                  String(to.params.connectionID),
                  Number(to.params.width),
                  Number(to.params.length),
                  Number(to.params.height),
                  Number(to.params.weight),
                  String(to.params.type),
                )
              } else if (to.params.connectionID != 'failed') {
                next()
              } else if (to.params.retry || to.params.id == 'failed') {
                const { cookies } = useCookies()
                const parcelCookies = cookies.get('parcelForm') as ParcelCookies | null

                if (parcelCookies) {
                  next({
                    name: 'parcelOrder',
                    params: {
                      connectionID: parcelCookies.connectionID,
                      width: parcelCookies.width,
                      height: parcelCookies.height,
                      length: parcelCookies.length,
                      weight: parcelCookies.weight,
                      type: parcelCookies.type,
                      retry: 'true',
                    },
                  })
                } else {
                  next()
                }
              } else {
                next({ name: 'popularDestinations' })
              }
            } else {
              next()
            }
          },
        },

        {
          path: 'connection/:id/:adults/:children/:teenagers/:retry',
          name: 'connection',
          component: Connection,
          beforeEnter: (to, from, next) => {
            if (
              Number(to.params.adults) <= 0 ||
              isNaN(Number(to.params.children)) ||
              isNaN(Number(to.params.teenagers)) ||
              String(to.params.id).length != 36 ||
              (String(to.params.retry) != 'true' && String(to.params.retry) != 'false')
            ) {
              next({ name: 'popularDestinations' })
            }

            const app = useAppStore()
            if (!app.loggedIn) {
              unloggedinTicketSelect(
                String(to.params.id),
                Number(to.params.adults),
                Number(to.params.teenagers),
                Number(to.params.children),
              )
            } else if (to.params.id != 'failed' && Number(to.params.adults) > 0) {
              next()
            } else if (to.params.retry || to.params.id == 'failed') {
              const { cookies } = useCookies()
              const ticketForm = cookies.get('ticketForm') as NewTicket | null

              if (ticketForm) {
                next({
                  name: 'connection',
                  params: {
                    id: ticketForm.connection.id,
                    adults: ticketForm.passengers.filter((passenger) => passenger.type == 'Adult')
                      .length,
                    children: ticketForm.passengers.filter((passenger) => passenger.type == 'Child')
                      .length,
                    teenagers: ticketForm.passengers.filter(
                      (passenger) => passenger.type == 'Teenager',
                    ).length,
                    retry: 'true',
                  },
                })
              } else {
                next()
              }
            } else {
              next({ name: 'popularDestinations' })
            }
          },
        },

        {
          path: 'news',
          name: 'news',
          component: NewsView,
        },

        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          beforeEnter: (to, from, next) => {
            const app = useAppStore()

            if (!app.loggedIn) {
              next({ name: 'login' })
            } else if (to.name == 'profile') {
              next({ name: 'general' })
            } else {
              next()
            }
          },
          children: [
            {
              path: 'general',
              name: 'general',
              component: General,
            },
            {
              path: 'tickets',
              name: 'tickets',
              component: Tickets,
            },
            {
              path: 'parcels',
              name: 'parcels',
              component: Parcels,
            },
          ],
        },
      ],
    },

    {
      path: '/authentication',
      name: 'authentication',
      component: AuthenticationView,
      beforeEnter: (to, from, next) => {
        const app = useAppStore()

        if (app.loggedIn) {
          next({ name: 'connections' })
        } else {
          next()
        }
      },
      children: [
        {
          path: 'log-in',
          name: 'login',
          component: LoginForm,
        },
        {
          path: 'forgot-password',
          name: 'forgotPassword',
          component: ForgotPassword,
          beforeEnter: (to, from, next) => {
            if (to.name == 'forgotPassword') {
              next({
                name: 'changePasswordEmailVerification',
              })
            } else {
              next()
            }
          },
          children: [
            {
              path: 'verify-email',
              name: 'changePasswordEmailVerification',
              component: VerifyEmail,
            },
            {
              path: 'verify-email/code',
              name: 'changePasswordEmailCodeVerification',
              component: VerifyEmailCode,
              beforeEnter: (to, from, next) => {
                if (
                  cookies.get('emailChangePasswordCodeVerificationLink') &&
                  cookies.get('emailChangePasswordToVerify')
                ) {
                  next()
                } else {
                  next({ name: 'changePasswordEmailVerification' })
                }
              },
            },
            {
              path: 'new',
              name: 'newPassword',
              component: ChangePssword,
              beforeEnter: (to, from, next) => {
                if (
                  cookies.get('emailChangePasswordAccessToken') &&
                  cookies.get('emailChangePasswordToVerify')
                ) {
                  next()
                } else if (
                  cookies.get('emailChangePasswordCodeVerificationLink') &&
                  cookies.get('emailChangePasswordToVerify')
                ) {
                  next({ name: 'changePasswordEmailCodeVerification' })
                } else {
                  next({ name: 'changePasswordEmailVerification' })
                }
              },
            },
          ],
        },
        {
          path: 'sing-up',
          name: 'singup',
          component: Signup,
          beforeEnter: (to, from, next) => {
            if (to.name === 'singup') {
              next({ name: 'sinupEmail' })
            } else {
              next()
            }
          },
          children: [
            {
              path: 'email-verification',
              name: 'emailVerification',
              component: EmailVerification,
              beforeEnter: (to, from, next) => {
                if (cookies.get('emailCodeVerificationLink') && cookies.get('emailToVerify')) {
                  next()
                } else {
                  next({ name: 'sinupEmail' })
                }
              },
            },
            {
              path: 'email',
              name: 'sinupEmail',
              component: EmailForm,
            },
            {
              path: 'user-data',
              name: 'singupForm',
              component: SingUpForm,
              beforeEnter: (to, from, next) => {
                if (cookies.get('emailVerificationToken') && cookies.get('emailToVerify')) {
                  next()
                } else {
                  next({ name: 'sinupEmail' })
                }
              },
            },
          ],
        },
      ],
    },
    {
      path: '/internal-server-error',
      name: 'internalServerError',
      component: InternalServerErrorView,
      beforeEnter: (to, from, next) => {
        if (!from.name) {
          const app = useAppStore()
          app.repeatTestServerAtempt = true
          next()
        } else {
          next()
        }
      },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/support',
      name: 'support',
      component: SupportView,
    },
    {
      path: '/:pathMatch(.*)*', // catch all undefined routes
      redirect: { name: 'popularDestinations' }, // redirects to homepage
    },
  ],
})

export default router

export let previousRouteName: RouteRecordNameGeneric = ''
router.beforeEach((to, from, next) => {
  previousRouteName = from.name
  next()
})
