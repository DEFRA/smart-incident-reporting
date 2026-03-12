import { definePage, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'BlockageLocationDescription',
  slug: 'blockage/location-description',
  title: 'Location description',
})

export const locationDescription = textInput('Describe the location')

// Validation error (empty submit)
export const requiredError = errorText("Enter a description of where you've seen the problem")
