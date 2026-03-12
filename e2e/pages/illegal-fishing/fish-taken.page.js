import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'IllegalFishingFishTaken',
  slug: 'illegal-fishing/fish-taken',
  title: "Did you see fish being 'taken'?"
})

export const yes = radioOption('Yes')
export const no = radioOption('No')

// Validation error (empty submit)
export const requiredError = errorText("Select 'yes' if you have seen fish being taken")
