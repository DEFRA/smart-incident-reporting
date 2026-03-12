import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'PollutionLength',
  slug: 'water-pollution/pollution-length',
  title: 'How far along the water feature does the pollution spread?'
})

export const stretches10to100m = radioOption('10 to 100 metres (less than 2 minutes average walk)')
export const stretches100to500m = radioOption('100 to 500 metres (around 2 to 8 minutes walk)')
export const stretches500metresTo1km = radioOption('500 metres to a kilometre (around 8 to 16 minutes walk)')
export const over1km = radioOption('Over a kilometre')
export const youDoNotKnow = radioOption('You do not know')

// Validation error (empty submit)
export const requiredError = errorText('Select a length')
