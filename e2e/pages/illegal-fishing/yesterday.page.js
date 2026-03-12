import { definePage, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'IllegalFishingYesterday',
  slug: 'illegal-fishing/yesterday',
  title: 'What time yesterday?'
})

export const time = textInput('Time')

// Validation error (empty submit)
export const requiredError = errorText('Enter a time')
