import { definePage, checkboxOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellDescription',
  slug: 'smell/description',
  title: 'How would you describe the smell?'
})

export const sewage = checkboxOption('Sewage')
export const rubbishOrRefuse = checkboxOption('Rubbish or refuse')
export const burningOrSmoke = checkboxOption('Burning or smoke')
export const gasOrPetrol = checkboxOption('Gas or petrol')
export const agriculture = checkboxOption('Agriculture')
export const somethingElse = checkboxOption('Something else')
export const cannotDescribe = checkboxOption('You cannot describe it')

// Validation error (empty submit)
export const requiredError = errorText('Select the description of the smell')
