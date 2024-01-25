import { Schema } from 'mongoose'

export const ConfigSchema = new Schema({
  cronExpression: { type: String, required: true },
  keyword: { type: String, required: true },
})
