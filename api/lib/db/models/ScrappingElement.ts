import { Schema } from 'mongoose'

export const ScrappingElementSchema = new Schema({
  url: { type: String, index: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
})
