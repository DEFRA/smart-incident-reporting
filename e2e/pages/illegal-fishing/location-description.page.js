import { definePage, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'IllegalFishingLocationDescription',
  slug: 'illegal-fishing/location-description',
  title: "Describe the location where you've seen illegal fishing"
})

export const locationDescription = textInput("Describe the location where you've seen illegal fishing")

// Validation error (empty submit)
export const requiredError = errorText("Enter a description of where you've seen illegal fishing")
