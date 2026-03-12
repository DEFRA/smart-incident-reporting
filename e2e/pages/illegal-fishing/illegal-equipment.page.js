import { definePage, checkboxOption, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'IllegalFishingIllegalEquipment',
  slug: 'illegal-fishing/illegal-equipment',
  title: 'What illegal equipment is being used?',
})

export const netsOrTraps = checkboxOption('Nets or traps')
export const fixedLines = checkboxOption('Fixed lines')
export const illegalRodOrTackle = checkboxOption('Illegal rod or tackle')
export const electricStunDevices = checkboxOption("Electric 'stun' devices")
export const somethingElse = checkboxOption('Something else')
export const unknown = checkboxOption('You do not know')

export const somethingElseDetail = textInput('Give details of the equipment')

// Validation error (empty submit)
export const requiredError = errorText('Select what equipment is being used or you do not know')
