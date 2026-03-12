import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellClothingAndHair',
  slug: 'smell/clothing-and-hair',
  title: 'Does the smell stick to your clothing or hair?'
})

export const yes = radioOption('Yes')
export const no = radioOption('No')

// Validation error (empty submit)
// Note: message varies; tests set indoors to 'yes'.
export const requiredError = errorText("Select 'yes' if the smell sticks to your clothing or hair")
