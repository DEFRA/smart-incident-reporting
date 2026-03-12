import { definePage, checkboxOption, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'PollutionAppearance',
  slug: 'water-pollution/pollution-appearance',
  title: 'What does the pollution look like?'
})

export const cloudyOrGreyWater = checkboxOption('Cloudy or grey water')
export const rainbowFilm = checkboxOption("A 'rainbow' film on top of the water")
export const foamOrScum = checkboxOption('A foam or scum')
export const somethingElse = checkboxOption('Something else')

export const somethingElseDetail = textInput('Give details about what the pollution looks like ')

// Validation error (empty submit)
export const requiredError = errorText('Select what the pollution looks like')
