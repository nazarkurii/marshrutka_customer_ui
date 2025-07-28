import { newUserTemplate, type NewUser } from '@/scripts/authentication'
import { Problem } from '@/scripts/errors'
import type { Link } from '@/scripts/request'
import axios from 'axios'
import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies'

export const useSingupStore = defineStore('sinup', {
  state: () => ({
    user: newUserTemplate,
    emailCodeVerificationLink: '',
    emailVerificationToken: '',
  }),

  actions: {
    setUser(user: NewUser) {
      this.user = user
    },
    async verifyEmail(email: string): Promise<{ exists: boolean; problem: Problem | undefined }> {
      const result: { exists: boolean; problem: Problem | undefined } = {
        exists: false,
        problem: undefined,
      }
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
        } = await axios.post('/verify-email', {
          email: email,
        })
        result.exists = data.exists
        if (!data.exists) {
          this.emailCodeVerificationLink = data.links.verifyEmailCode.href
        }
      } catch (err) {
        const problem = new Problem(err)
        result.problem = problem
      } finally {
        return result
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
    async do(): Promise<{ token: string; problem: Problem | undefined }> {
      let result: { token: string; problem: Problem | undefined } = {
        token: '',
        problem: undefined,
      }
      const formdata = new FormData()

      formdata.append('user', JSON.stringify(this.user))
      try {
        const {
          data,
        }: {
          data: {
            token: string
          }
        } = await axios.post('/register', formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Email-Access-Token': this.emailVerificationToken,
          },
        })

        result.token = data.token
      } catch (err) {
        const problem = new Problem(err)
        result.problem = problem
      } finally {
        return result
      }
    },
  },
})
