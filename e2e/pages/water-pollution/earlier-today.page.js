import { definePage, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'WaterPollutionEarlierToday',
  slug: 'water-pollution/earlier-today',
  title: 'What time today did you see the pollution?'
})

export const time = textInput('Time')

// Validation error (empty submit)
export const requiredError = errorText('Enter a time')
