import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellCurrent',
  slug: 'smell/current',
  title: 'Is the smell still there?',
})

export const yes = radioOption('Yes')
export const no = radioOption('No')

// Validation error (empty submit)
export const requiredError = errorText("Select 'yes' if the smell is still there")
