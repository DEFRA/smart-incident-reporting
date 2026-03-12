import { definePage, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellYesterday',
  slug: 'smell/yesterday',
  title: 'What time yesterday did you first notice the smell?',
})

export const time = textInput('Time')

// Validation error (empty submit)
export const requiredError = errorText('Enter a time')
