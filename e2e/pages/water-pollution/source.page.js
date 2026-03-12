import { definePage, radioOption, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'WaterPollutionSource',
  slug: 'water-pollution/source',
  title: 'Do you know where the pollution is coming from?',
})

export const yes = radioOption('Yes')
export const no = radioOption('No')
export const yesDetails = textInput('Give details about where the pollution is coming from')

// Validation error (empty submit)
export const requiredError = errorText("Select 'yes' if you know where the pollution is coming from")
