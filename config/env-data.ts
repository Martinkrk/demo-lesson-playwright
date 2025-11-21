import dotenv from 'dotenv'

if (process.env.CI !== 'true') {
  dotenv.config({ path: 'env/prod.env' })
}

const requiredVars = ['URL', 'TEST_USERNAME', 'TEST_PASSWORD']

requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})

export const SERVICE_URL: string = process.env.URL!
export const USERNAME: string = process.env.TEST_USERNAME!
export const PASSWORD: string = process.env.TEST_PASSWORD!
