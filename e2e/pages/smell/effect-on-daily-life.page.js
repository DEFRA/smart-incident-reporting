import { definePage, checkboxOption, textInput, errorText } from '../utils.js'

export const page = definePage({
  key: 'SmellEffectOnDailyLife',
  slug: 'smell/effect-on-daily-life',
  title: 'Did you do any of the following because of the smell?'
})

export const leaveArea = checkboxOption('Leave the area of the smell')
export const keepWindowsOrDoorsClosed = checkboxOption('Keep windows or doors closed')
export const avoidUsingPartsOfProperty = checkboxOption('Avoid using parts of your property, for example your garden')
export const putOffDoingSomething = checkboxOption('Put off doing something, for example going to the shops')
export const cancelOrNotAttendEvent = checkboxOption('Cancel, or not attend an event or planned activity')
export const somethingElse = checkboxOption('Something else')
export const noneOfThese = checkboxOption('None of these')

export const putOffDetails = textInput('Give details about what you put off doing')
export const eventDetails = textInput('Give details about the event')
export const somethingElseDetails = textInput('Give details about what happened')

// Validation error (empty submit)
export const requiredError = errorText("Select any of the following you did because of the smell, or 'none of these'")
