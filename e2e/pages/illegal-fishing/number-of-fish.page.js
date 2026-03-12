import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'IllegalFishingNumberOfFish',
  slug: 'illegal-fishing/number-of-fish',
  title: 'How many fish?'
})

export const fiveOrMore = radioOption('5 or more')
export const lessThanFive = radioOption('Less than 5')
export const youDoNotKnow = radioOption('You do not know')

// Validation error (empty submit)
export const requiredError = errorText("Select how many fish or 'you do not know'")
