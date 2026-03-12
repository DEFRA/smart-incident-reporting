import { definePage, radioOption, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'BlockageRiverName',
  slug: 'blockage/river-name',
  title: 'Do you know the name of the river?',
})

export const yes = radioOption('Yes')
export const no = radioOption('No')

export const yesDetails = textInput('Name of the river')

// Validation errors
export const requiredError = errorText('Enter the name of the river')
