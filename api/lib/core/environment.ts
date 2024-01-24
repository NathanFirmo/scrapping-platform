import * as dotenv from 'dotenv'
dotenv.config()

export const environment = {
  envVarIsMissing: false,
  check: () => {
    for (const [key, value] of Object.entries(environment)) {
      if (key === 'check') continue
      if (value === 'undefined' || Number.isNaN(value)) {
        console.log(key, 'env var is missing.')
        environment.envVarIsMissing = true
      }
    }

    if (environment.envVarIsMissing) {
      throw new Error('Missing env var, shutting down')
    }
  },
  nodeEnv: String(process.env.NODE_ENV),
  mongoUrl: String(process.env.MONGODB_URI),
  mongoUser: String(process.env.MONGODB_USER),
  mongoPassword: String(process.env.MONGODB_PASSWORD),
  port: String(process.env.PORT) ?? 3000
}
