import axios from 'axios'
import { Problem } from './errors'
import type { Link } from './request'

export interface Adress {
  country: string
  city: string
  street: string
  houseNumber: string
  apartmentNumber?: string
  googleMapsID: string
  formated: string
}

export async function getAdresses(page: number | undefined): Promise<{
  adresses: Adress[]
  links: Link[]
  problem: Problem | null
}> {
  const result: {
    adresses: Adress[]
    links: Link[]
    problem: Problem | null
  } = {
    adresses: [],
    links: [],
    problem: null,
  }
  try {
    const base = '/adresses?size=6'
    const { data }: { data: { adresses: Adress[]; links: Link[] } } = await axios.get(
      page ? base + '&page=' + page : base,
    )

    result.adresses = data.adresses
    result.links = data.links
  } catch (err) {
    const problem = new Problem(err)
    result.problem = problem
  } finally {
    return result
  }
}

export const adressTemplate: Adress = {
  country: '',
  city: '',
  street: '',
  houseNumber: '',
  apartmentNumber: '',
  googleMapsID: '',
  formated: '',
}
