import { button, definePage, textInput } from '../utils.js'

export const page = definePage({
  key: 'SmellOtherInformation',
  slug: 'smell/other-information',
  title: "Is there anything else you'd like to add?"
})

export const otherInfo = textInput("Is there anything else you'd like to add?")

export const sendReportButton = button('Send report')
