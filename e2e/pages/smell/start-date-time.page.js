import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellStartDateTime',
  slug: 'smell/start-date-time',
  title: 'What date did the smell start, on this occasion?'
})

export const now = radioOption('Now')
export const earlierToday = radioOption('Earlier today')
export const yesterday = radioOption('Yesterday')
export const beforeYesterday = radioOption('Before yesterday')

// Validation error (empty submit)
export const requiredError = errorText('Select when you noticed the smell')
