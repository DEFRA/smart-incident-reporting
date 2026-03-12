import { definePage, radioOption, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'BlockageType',
  slug: 'blockage/blockage-type',
  title: "What's blocking the river?"
})

export const fallenTree = radioOption('A fallen tree or other vegetation')
export const vehicle = radioOption('A vehicle')
export const rubbish = radioOption('A build-up of material, such as rubbish, soil or stone')
export const deliberate = radioOption('Someone deliberately blocking the river, for example with a temporary structure')
export const somethingElse = radioOption('Something else')
export const youDoNotKnow = radioOption('You do not know')

export const somethingElseDetails = textInput('Give details about what is blocking the river')

// Validation error (empty submit)
export const requiredError = errorText("Select what's blocking the river or you do not know")
