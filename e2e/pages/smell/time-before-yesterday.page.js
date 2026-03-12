import { definePage, textInput } from '../utils.js'

export const page = definePage({
  key: 'SmellTimeBeforeYesterday',
  slug: 'smell/time-before-yesterday',
  title: 'What time on [date] did you first notice the smell?'
})

export const time = textInput('Time')
