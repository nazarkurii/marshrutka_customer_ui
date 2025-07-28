import { newUserTemplate, type NewUser } from '@/scripts/authentication'
import { Problem } from '@/scripts/errors'
import type { Link } from '@/scripts/request'
import axios from 'axios'
import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies'

export const useForgotPasswordStore = defineStore('forgotPassword', {
  state: () => ({
    email: '',

    emailCodeVerificationLink: '',
    emailVerificationToken: '',
  }),

  actions: {
    async verifyEmail(): Promise<Problem | undefined> {
      try {
        const {
          data,
        }: {
          data: {
            exists: boolean
            links: {
              verifyEmailCode: Link
            }
          }
        } = await axios.post('/change-password/verify-email', {
          email: this.email,
        })

        this.emailCodeVerificationLink = data.links.verifyEmailCode.href

        return undefined
      } catch (err) {
        return new Problem(err)
      }
    },
    async verifyEmailCode(code: string): Promise<Problem | undefined> {
      let result: Problem | undefined = undefined
      try {
        const {
          data,
        }: {
          data: {
            token: string
          }
        } = await axios.post(this.emailCodeVerificationLink, {
          code: code,
        })

        this.emailVerificationToken = data.token
      } catch (err) {
        const problem = new Problem(err)
        result = problem
      } finally {
        return result
      }
    },
    async do(password: string): Promise<Problem | undefined> {
      try {
        const {
          data,
        }: {
          data: {
            token: string
          }
        } = await axios.post(
          '/change-password',
          {
            email: this.email,
            password: password,
          },
          {
            headers: {
              'X-Email-Access-Token': this.emailVerificationToken,
            },
          },
        )
        console.log(data)
        return undefined
      } catch (err) {
        return new Problem(err)
      }
    },
  },
})
