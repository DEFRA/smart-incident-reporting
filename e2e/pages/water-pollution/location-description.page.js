import { definePage, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'LocationDescription',
  slug: 'water-pollution/location-description',
  title: 'Location description',
})

export const locationDescription = textInput("Describe where you've seen pollution")

// Validation error (empty submit)
export const requiredError = errorText("Enter a description of where you've seen pollution")
