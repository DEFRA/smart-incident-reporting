import { definePage, textInput } from '../utils.js'

export const page = definePage({
  key: 'IllegalFishingRodLicence',
  slug: 'illegal-fishing/rod-licence',
  title: 'How do you know the people fishing do not have a rod licence?'
})

export const noRodLicenceDetails = textInput('How do you know the people fishing do not have a rod licence?')
