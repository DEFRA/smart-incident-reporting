import { definePage, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'IllegalFishingEarlierToday',
  slug: 'illegal-fishing/earlier-today',
  title: 'What time today?'
})

export const time = textInput('Time')

// Validation error (empty submit)
export const requiredError = errorText('Enter a time')
