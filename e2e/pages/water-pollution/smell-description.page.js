import { definePage, radioOption, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellDescriptionWaterPollution',
  slug: 'water-pollution/smell-description',
  title: 'Is there a smell?',
})

export const yes = radioOption('Yes')
export const no = radioOption('No')

export const describeTheSmell = textInput('Describe the smell')

// Validation error (empty submit)
export const requiredError = errorText("Select 'yes' if there is a smell")
