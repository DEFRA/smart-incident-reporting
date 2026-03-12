import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'BlockageRiver',
  slug: 'blockage/river',
  title: 'Is the blockage in a river?'
})

export const yes = radioOption('Yes')
export const no = radioOption("No, it's some other kind of water")
export const notSure = radioOption("You're not sure")

// Validation error (empty submit)
export const requiredError = errorText("Select 'yes' if the blockage is in a river")
