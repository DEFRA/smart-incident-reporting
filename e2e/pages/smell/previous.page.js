import { definePage, radioOption, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellPrevious',
  slug: 'smell/previous',
  title: 'Has this smell caused you problems before?'
})

export const often = radioOption('Yes, it happens often')
export const nowAndThen = radioOption('Yes, now and then')
export const firstTime = radioOption('No, this is the first time')

// Validation error (empty submit)
export const requiredError = errorText("Select 'yes' if the smell has caused you a problem before")
