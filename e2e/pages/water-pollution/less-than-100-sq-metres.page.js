import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'LessThan100SqMetres',
  slug: 'water-pollution/less-than-100-sq-metres',
  title: 'How much pollution have you seen?'
})

export const moreThan100SqMetres = radioOption('More than 100 square metres')
export const lessThan100SqMetres = radioOption('Less than 100 square metres')

// Validation error (empty submit)
export const requiredError = errorText('Select how much pollution you have seen')
