import { definePage, checkboxOption, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'PollutionSubstance',
  slug: 'water-pollution/pollution-substance',
  title: 'What do you think the pollution is?',
})

export const sewage = checkboxOption('Sewage')
export const oilOrPetrol = checkboxOption('Oil or petrol')
export const agriculturalWaste = checkboxOption('Agricultural waste, for example from muck spreading')
export const rubbishOrRefuse = checkboxOption('Rubbish or refuse')
export const somethingElse = checkboxOption('Something else')
export const unknown = checkboxOption('You do not know')

export const somethingElseDetail = textInput('Give details about what you think the pollution is')

// Validation error (empty submit)
export const requiredError = errorText("Select what you think the pollution is, or 'you do not know'")
