import { definePage, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'BlockageYesterday',
  slug: 'blockage/yesterday',
  title: 'What time yesterday did you see this?'
})

export const time = textInput('Time')

// Validation error (empty submit)
export const requiredError = errorText('Enter a time')
