import { definePage, checkboxOption, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'BlockageFloodRiskDanger',
  slug: 'blockage/flood-risk-danger',
  title: 'What is at risk from flooding?',
})

export const yourHome = checkboxOption('Your home or parts of it, including your garage if attached')
export const yourOtherProperty = checkboxOption('Other property you own, for example your garden, sheds or a detached garage')
export const otherPeoplesHomes = checkboxOption("Other people's homes")
export const commercialOrPublicBuildings = checkboxOption('Commercial or public buildings, for example shops or businesses')
export const roadsRailwaysPowerlines = checkboxOption('Roads, railways, powerlines or similar')
export const farmlandOrCountryside = checkboxOption('Farmland or countryside')
export const animals = checkboxOption('Animals, for example cattle or horses')
export const somethingElse = checkboxOption('Something else')
export const unknown = checkboxOption('You do not know')

export const commercialPropertyDetail = textInput('Give details about type of building at risk from flooding')
export const somethingElseDetail = textInput('Give details about what is at risk from flooding')

// Validation error (empty submit)
export const requiredError = errorText("Select what is at risk from flooding or 'you do not know'")
