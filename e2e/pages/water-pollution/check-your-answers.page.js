import { definePage, button } from '../utils.js'

export const page = definePage({
  key: 'WaterPollutionCheckYourAnswers',
  slug: 'water-pollution/check-your-answers',
  title: 'Check your answers before sending your report'
})

export const sendReportButton = button('Finish and send report')
