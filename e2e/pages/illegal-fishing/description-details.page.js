import { definePage, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'IllegalFishingDescriptionDetails',
  slug: 'illegal-fishing/description-details',
  title: 'Describe the people involved'
})

export const descriptionDetails = textInput('Describe the people involved')
export const vehicleRegistration = textInput('Vehicle registration (if known)')

// Validation error (empty submit)
export const requiredError = errorText('Enter a description of the people involved')
