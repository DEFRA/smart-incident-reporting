import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellMedicalHelp',
  slug: 'smell/medical-help',
  title: 'Have you had to get any medical help because of the smell?',
})

export const yes = radioOption('Yes')
export const no = radioOption('No')

// Validation error (empty submit)
export const requiredError = errorText("Select 'yes' if you had to get any medical help because of the smell")
