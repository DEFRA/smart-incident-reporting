import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellImagesOrVideo',
  slug: 'smell/images-or-video',
  title: 'Do you want to send us any images or videos of the problem?'
})

export const yes = radioOption('Yes')
export const no = radioOption('No')

// Validation error (empty submit)
export const requiredError = errorText("Select 'yes' if you want to send us any images or videos")
