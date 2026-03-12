import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'BlockageWhen',
  slug: 'blockage/when',
  title: 'When did you notice this?'
})

export const now = radioOption('Now')
export const earlierToday = radioOption('Earlier today')
export const yesterday = radioOption('Yesterday')
export const beforeYesterday = radioOption('Before yesterday')

// Validation error (empty submit)
export const requiredError = errorText('Select when you saw this')
