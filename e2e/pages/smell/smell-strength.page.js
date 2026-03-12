import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellStrength',
  slug: 'smell/smell-strength',
  title: 'How strong is the smell?',
})

export const veryWeak = radioOption('Very weak')
export const weak = radioOption('Weak')
export const distinct = radioOption('Distinct')
export const strong = radioOption('Strong')
export const veryStrong = radioOption('Very strong')
export const extremelyStrong = radioOption('Extremely strong')

// Validation error (empty submit)
// Note: error text varies based on 'current' context; tests set current to 'yes'.
export const requiredError = errorText('Select how strong the smell is')
