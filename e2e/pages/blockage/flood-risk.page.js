import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'BlockageFloodRisk',
  slug: 'blockage/flood-risk',
  title: 'Will the blockage cause a flood if it is not removed?',
})

export const alreadyFlooding = radioOption("There's already flooding")
export const yes = radioOption('Yes')
export const no = radioOption('No')
export const youDoNotKnow = radioOption('You do not know')

// Validation error (empty submit)
export const requiredError = errorText("Select whether the blockage will cause a flood or 'you do not know'")
