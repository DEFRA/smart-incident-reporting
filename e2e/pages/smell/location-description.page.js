import { definePage, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellLocationDescription',
  slug: 'smell/location-description',
  title: 'Describe the location where you noticed the smell'
})

export const locationDescription = textInput('Describe the location where you noticed the smell')

// Validation error (empty submit)
export const requiredError = errorText('Enter a description of the location')
