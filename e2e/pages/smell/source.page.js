import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellSource',
  slug: 'smell/source',
  title: 'Where is the smell coming from?',
})

export const wasteSite = radioOption('A waste site, for example a landfill or recycling centre')
export const industry = radioOption('A large industrial site, factory or business, for example a food processing plant')
export const sewage = radioOption('A sewage or water treatment works')
export const agriculturalSite = radioOption('Agricultural site or activity, for example muck spreading')
export const localBusiness = radioOption('A small local business, for example a restaurant')
export const neighbouringProperty = radioOption('A neighbouring property')
export const householdWaste = radioOption('Household waste and rubbish')
export const unknown = radioOption('Something else or you do not know')

// Validation error (empty submit)
export const requiredError = errorText('Select a type of place or activity where the smell is coming from')
