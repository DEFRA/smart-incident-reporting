import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'PollutionArea',
  slug: 'water-pollution/pollution-area',
  title: 'How large an area does the pollution cover?',
})

export const under500sqm = radioOption('100 to 500 square metres (sq m)')
export const over500sqm = radioOption('More than 500 sq m')
export const youDoNotKnow = radioOption('You do not know')

// Validation error (empty submit)
export const requiredError = errorText('Select a size of area')
