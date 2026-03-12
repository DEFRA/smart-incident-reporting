import { definePage, radioOption, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'BlockageHistory',
  slug: 'blockage/history',
  title: 'Has the blockage been here for some time?'
})

export const yes = radioOption('Yes')
export const no = radioOption('No')
export const youDoNotKnow = radioOption('You do not know')

export const yesDetails = textInput('Give details about how long the blockage has been here')

// Validation error (empty submit)
export const requiredError = errorText("Select whether the blockage has been here for some time or 'you do not know'")
