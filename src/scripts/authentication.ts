import type { Router } from 'vue-router'
import { Problem } from './errors'
import axios from 'axios'
import { useCookies } from 'vue3-cookies'

export interface NewUser {
  firstName: string
  lastName: string
  dateOfBirth: string
  phoneNumber: string
  email: string
  password: string
}

export interface NewUserDataViolation {
  firstName: boolean
  lastName: boolean
  dateOfBirth: boolean
  phoneNumber: boolean
  email: boolean
  password: boolean
}

export const newUserTemplate: NewUser = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  phoneNumber: '',
  email: '',
  password: '',
}

export function validate(user: NewUser): { violation: NewUserDataViolation; isValid: boolean } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/

  const violation: NewUserDataViolation = {
    firstName: user.firstName.trim().length === 0,
    lastName: user.lastName.trim().length === 0,
    dateOfBirth: user.dateOfBirth.trim().length === 0,
    phoneNumber: user.phoneNumber.trim().length < 5,
    email: !emailRegex.test(user.email),
    password: !passwordRegex.test(user.password),
  }

  const isValid = !Object.values(violation).some((v) => v)

  return { violation, isValid }
}

export interface InvalidParams {
  firstName: boolean
  lastName: boolean
  dateOfBirth: boolean
  phoneNumber: boolean
  password: boolean
  emailToken: boolean
}

export function identifyInvalidParams(problem: Problem): InvalidParams {
  const params = {
    firstName: false,
    lastName: false,
    dateOfBirth: false,
    phoneNumber: false,
    password: false,
    emailToken: false,
  }
  if (problem.invalidParams) {
    for (const param of problem.invalidParams) {
      if (param.name in params) {
        params[param.name as keyof InvalidParams] = true
      }
    }
  }

  return params
}

export async function loginWithToken(token: string): Promise<{ ok: boolean; err: unknown }> {
  try {
    axios.defaults.headers.common.Authorization = token
    const { data }: { data: { token: string } } = await axios.post('/login-jwt')
    const { cookies } = useCookies()
    cookies.set('token', data.token, '30d')
    axios.defaults.headers.common.Authorization = data.token
    return { ok: true, err: undefined }
  } catch (err) {
    return { ok: false, err: err }
  }
}

export interface UnloggedinTicketSelectionAttemt {
  connectionID: string
  teenagers: number
  adults: number
  children: number
}

export interface UnloggedinParcelSelectionAttempt {
  connectionID: string
  width: number
  length: number
  height: number
  weight: number
  type: 'documents' | 'package'
}
