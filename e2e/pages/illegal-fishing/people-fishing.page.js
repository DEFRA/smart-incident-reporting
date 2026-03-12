import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'IllegalFishingPeopleFishing',
  slug: 'illegal-fishing/people-fishing',
  title: 'Are people fishing here now?',
})

export const yes = radioOption('Yes')
export const no = radioOption('No')
export const youDoNotKnow = radioOption('You do not know')

// Validation error (empty submit)
export const requiredError = errorText("Select 'yes' if people are fishing at the location now")
