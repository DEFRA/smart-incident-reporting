import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellIndoors',
  slug: 'smell/indoors',
  title: 'Is the smell noticeable indoors?'
})

export const yes = radioOption('Yes')
export const noOutsideOnly = radioOption('No, you can only smell it outside')

// Validation error (empty submit)
// Note: dynamic text; tests set current to 'yes'.
export const requiredError = errorText("Select 'yes' if the smell is noticeable indoors")
