import { definePage, checkboxOption, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'IllegalFishingActivity',
  slug: 'illegal-fishing/activity',
  title: 'What illegal fishing activity do you want to report?'
})

export const withoutPermission = checkboxOption('Fishing without permission of the owner or club')
export const withoutRodLicence = checkboxOption('Fishing without a rod licence')
export const outOfSeason = checkboxOption('Fishing out of season')
export const illegalFishingEquipment = checkboxOption('Use of illegal fishing equipment')
export const protectedSpecies = checkboxOption('Fishing for protected species (including seasonal)')
export const somethingElse = checkboxOption('Something else')

export const somethingElseDetails = textInput('Give details of the activity')

// Validation error (empty submit)
export const requiredError = errorText('Select the illegal activity you want to report')
