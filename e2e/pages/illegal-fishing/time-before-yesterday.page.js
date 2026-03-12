import { definePage, textInput } from '../utils.js'

export const page = definePage({
  key: 'IllegalFishingTimeBeforeYesterday',
  slug: 'illegal-fishing/time-before-yesterday',
  title: 'What time on [date]?'
})

export const time = textInput('Time')
