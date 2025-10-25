export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      $app: {
        BASE_API: string,
        APP_VERSION: number
      }
    }
  }
}
