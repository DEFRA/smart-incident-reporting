import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'IllegalFishingPeopleDescription',
  slug: 'illegal-fishing/people-description',
  title: 'Can you describe anyone involved?'
})

export const yes = radioOption('Yes')
export const no = radioOption('No')
export const wouldPreferNotTo = radioOption('You would prefer not to')

// Validation error (empty submit)
export const requiredError = errorText("Select 'yes' if you can describe anyone involved")
