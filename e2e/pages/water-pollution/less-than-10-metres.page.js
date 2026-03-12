import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'LessThan10Metres',
  slug: 'water-pollution/less-than-10-metres',
  title: 'How much pollution have you seen?',
})

export const moreThan10Metres = radioOption('More than 10 metres')
export const lessThan10Metres = radioOption('Less than 10 metres')

// Validation error (empty submit)
export const requiredError = errorText('Select how much pollution you have seen')
