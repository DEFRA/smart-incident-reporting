import { definePage, textInput } from '../utils.js'

export const page = definePage({
  key: 'BlockageContactDetails',
  slug: 'blockage/contact-details',
  title: 'Your contact details'
})

export const fullName = textInput('Your name (optional)')
export const email = textInput('Email address (optional)')
export const phone = textInput('Phone number (optional)')
