import { definePage, textInput, radioOption } from '../utils.js'

export const page = definePage({
  key: 'SmellSourceDetails',
  slug: 'smell/source-details',
  title: 'Can you give details about where the smell is coming from?',
})

export const siteName = textInput('Name of person or site')
export const sourceAddress = textInput('Street name and number (if known)')
export const sourceTown = textInput('Town or city')
export const sourcePostcode = textInput('Postcode (if known)')

export const yes = radioOption('Yes')
export const no = radioOption('No')
