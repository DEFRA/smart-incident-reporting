import { definePage, textInput } from '../utils.js'

export const page = definePage({
  key: 'SmellLocationAddress',
  slug: 'smell/location-address',
  title: 'Enter your address',
})

export const addressLine1 = textInput('Address line 1')
export const addressLine2 = textInput('Address line 2 (optional)')
export const townOrCity = textInput('Town or city')
export const county = textInput('County (optional)')
export const postcode = textInput('Postcode')
