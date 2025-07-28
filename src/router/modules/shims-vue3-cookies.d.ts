declare module 'vue3-cookies' {
  export const VueCookies: any
  export function useCookies(): {
    cookies: {
      get(key: string): string | null
      set(
        key: string,
        value: string,
        expireTimes?: string,
        path?: string,
        domain?: string,
        secure?: boolean,
      ): void
      remove(key: string): void
    }
  }
}
