import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellLocationOption',
  slug: 'smell/location-option',
  title: "How do you want to tell us where you've noticed the smell?",
})

export const useCurrentLocation = radioOption('Use your current location')
export const markOnOnlineMap = radioOption('Mark the location on an online map')
export const describeLocation = radioOption('Describe the location')

// Validation error (empty submit)
export const requiredError = errorText('Select how you want to give the location')
