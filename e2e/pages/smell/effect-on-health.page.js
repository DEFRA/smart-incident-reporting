import { definePage, checkboxOption, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellEffectOnHealth',
  slug: 'smell/effect-on-health',
  title: 'Did the smell cause any of these health problems, on this occasion?',
})

export const headache = checkboxOption('Headache')
export const wateringEyes = checkboxOption('Watering eyes')
export const sicknessOrNausea = checkboxOption('Sickness or nausea')
export const vomiting = checkboxOption('Vomiting')
export const somethingElseOrPreferNotToSay = checkboxOption("Something else or you'd prefer not to say")
export const noneOfThese = checkboxOption('None of these')
export const mentalHealthIssues = checkboxOption('Mental health issues, for example stress')

export const somethingElseDetails = textInput('Give details about the health problem')

// Validation error (empty submit)
export const requiredError = errorText("Select any health conditions caused by the smell, or 'none of these'")
