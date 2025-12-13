import dotenv from 'dotenv'

if (process.env.CI !== 'true') {
  dotenv.config({ path: 'env/prod.env' })
}

const requiredVars = ['URL', 'AUTH_URL', 'ORDER_URL', 'TEST_USERNAME', 'TEST_PASSWORD']

requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})

export const SERVICE_URL: string = process.env.URL!
export const AUTH_URL: string = process.env.AUTH_URL!
export const ORDER_URL: string = process.env.ORDER_URL!
export const USERNAME: string = process.env.TEST_USERNAME!
export const PASSWORD: string = process.env.TEST_PASSWORD!
