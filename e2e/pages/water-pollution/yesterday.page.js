import { definePage, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'WaterPollutionYesterday',
  slug: 'water-pollution/yesterday',
  title: 'What time yesterday did you see the pollution?',
})

export const time = textInput('Time')

// Validation error (empty submit)
export const requiredError = errorText('Enter a time')
