import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'BlockageWaterLevel',
  slug: 'blockage/water-level',
  title: 'Is water building up behind the blockage?',
})

export const yes = radioOption('Yes')
export const no = radioOption('No')
export const youDoNotKnow = radioOption('You do not know')

// Validation error (empty submit)
export const requiredError = errorText('Select ‘yes’ if water is building up behind the blockage')
