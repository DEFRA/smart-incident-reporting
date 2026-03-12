import { definePage, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'WaterPollutionTimeBeforeYesterday',
  slug: 'water-pollution/time-before-yesterday',
  title: 'What time on [date] did you see the pollution?'
})

export const time = textInput('Time')

// Validation error (empty submit)
export const requiredError = errorText('Enter a time')
