import { definePage, radioOption, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'EffectOnWildlife',
  slug: 'water-pollution/effect-on-wildlife',
  title: 'Have you seen any dead or distressed fish or animals nearby?'
})

export const yes = radioOption('Yes')
export const no = radioOption('No')

export const yesDetails = textInput("Give details about what you've seen, including the type and number of fish or animals affected")

// Validation error (empty submit)
export const requiredError = errorText("Select 'yes' if you've seen dead or distressed fish or other animals nearby")
