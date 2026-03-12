import { definePage, radioOption, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'WaterFeature',
  slug: 'water-pollution/water-feature',
  title: 'In what kind of water is the pollution?',
})

// Radio options
export const river = radioOption('A river')
export const lake = radioOption('A pond, lake or reservoir')
export const sea = radioOption('The sea')
export const canal = radioOption('A canal')
export const stream = radioOption('A smaller stream or watercourse')
export const somethingElse = radioOption('Something else')
export const dontKnow = radioOption('You do not know')

// Conditional text inputs
export const riverDetails = textInput('Name of river (if known)')
export const lakeOrReservoirDetails = textInput('Name of water (if known)')
export const canalDetails = textInput('Name of canal (if known)')
export const streamOrWatercourseDetails = textInput('Name of stream or watercourse (if known)')
export const somethingElseDetails = textInput('Describe the type of water')

// Validation error (empty submit)
export const requiredError = errorText('Select a type of watercourse or feature, or you do not know')
