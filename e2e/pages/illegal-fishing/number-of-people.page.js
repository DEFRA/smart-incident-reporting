import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'IllegalFishingNumberOfPeople',
  slug: 'illegal-fishing/number-of-people',
  title: 'How many people are there?',
})

export const one = radioOption('One')
export const two = radioOption('Two')
export const threeOrMore = radioOption('Three or more')

// Validation error (empty submit)
export const requiredError = errorText('Select how many people there are')
