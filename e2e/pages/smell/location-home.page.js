import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellLocationHome',
  slug: 'smell/location-home',
  title: 'Is the smell affecting you at home?',
})

export const yes = radioOption('Yes')
export const noSomewhereElse = radioOption('No, somewhere else')

// Validation error (empty submit)
export const requiredError = errorText("Select 'yes' if the smell is affecting you at home")
