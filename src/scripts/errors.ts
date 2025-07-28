import router from '@/router'
import { useAppStore } from '@/stores/app'
import { useRouter, type Router } from 'vue-router'

interface InvalidParam {
  name: string
  reason: string
}

interface ProblemData {
  type: string
  title: string
  status: number
  detail: string
  invalidParams?: InvalidParam[]
}

export class Problem {
  type: string
  title: string
  status: number
  detail: string
  invalidParams?: InvalidParam[]

  constructor(error: any, absolute: boolean = false) {
    if (error ? (error.response ? error.response.data : false) : false) {
      const data: ProblemData = error.response.data
      if (data.status == 500) {
        router.push({ name: 'internalServerError' })
      } else if (data.status == 502) {
        router.push({ name: 'internalServerError' })
      } else if (error.response.status == 404) {
        router.push({ name: 'internalServerError' })
      } else if (absolute) {
        router.push({ name: 'internalServerError' })
      }

      this.type = data.type
      this.title = data.title
      this.status = data.status
      this.detail = data.detail
      this.invalidParams = data.invalidParams
    } else {
      // Fallback for unknown error structure
      this.type = 'unknown_error'
      this.title = 'Unknown Error'
      this.status = 0
      this.detail = ''
      this.invalidParams = []
      const app = useAppStore()
      app.repeatTestServerAtempt = true
      router.push({ name: 'internalServerError' })
    }

    console.log({
      type: this.type,
      title: this.title,
      status: this.status,
      detail: this.detail,
      invalidParams: this.invalidParams,
    })
  }

  ifStatus(status: number, func: () => void) {
    if (this.status == status) {
      func()
    } else {
      router.push({ name: 'internalServerError' })
    }
  }
}
