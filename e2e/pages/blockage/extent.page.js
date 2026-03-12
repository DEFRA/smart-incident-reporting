import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'BlockageExtent',
  slug: 'blockage/extent',
  title: 'How much of the river is blocked?',
})

export const fullWidth = radioOption('The full width (from bank to bank)')
export const moreThanHalf = radioOption('More than half the width')
export const lessThanHalf = radioOption('Less than half the width')
export const youDoNotKnow = radioOption('You do not know')

// Validation error (empty submit)
export const requiredError = errorText('Select how much of the river is blocked or ’you do not know’')
