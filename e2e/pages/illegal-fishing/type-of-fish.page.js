import { definePage, checkboxOption, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'IllegalFishingTypeOfFish',
  slug: 'illegal-fishing/type-of-fish',
  title: 'What type of fish are being caught or targeted?',
})

export const salmon = checkboxOption('Salmon')
export const lampreyOrEel = checkboxOption('Lamprey or eel')
export const seaTrout = checkboxOption('Sea trout')
export const freshwaterFish = checkboxOption('Freshwater fish')
export const crayfish = checkboxOption('Crayfish')
export const otherFish = checkboxOption('Other fish')
export const unknown = checkboxOption('You do not know')

export const otherFishDetail = textInput('Give details of the type of fish')

export const requiredError = errorText("Select the type of fish or 'you do not know'")
