import Wreck from '@hapi/wreck'
import parser from 'cron-parser'
import config from './config.js'

const isWorkingHours = async (dateToTest = new Date()) => {
  try {
    if (config.serviceAvailableCron === '* * * * * *') {
      return true
    }

    // Get bank holiday data
    const { payload } = await Wreck.get('https://www.gov.uk/bank-holidays.json', {
      json: true
    })

    const dateString = dateToTest.toLocaleDateString('en-GB', { timeZone: 'Europe/London' })

    const bankHoliday = payload['england-and-wales'].events.find(event => dateString === new Date(event.date).toLocaleDateString('en-GB', { timeZone: 'Europe/London' }))

    if (bankHoliday) {
      return false
    }

    const interval = parser.parseExpression(config.serviceAvailableCron, {
      currentDate: dateToTest
    })

    return interval.fields.dayOfWeek.includes(dateToTest.getDay()) && interval.fields.hour.includes(dateToTest.getHours())
  } catch (err) {
    console.error(err)
    throw err
  }
}

export default isWorkingHours
