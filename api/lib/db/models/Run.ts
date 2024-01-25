import { Schema } from 'mongoose'

export const RunSchema = new Schema({
  date: { type: String, required: true },
  keyword: { type: String, required: true },
})
