import Wreck from '@hapi/wreck'
import parser from 'cron-parser'
import config from './config.js'

const isWorkingHours = async (dateToTest = new Date()) => {
  try {
    if (config.serviceAvailableCron === '* * * * * *') {
      return true
    }

    // logging for azure checking timezone correct when BST
    console.log(`Testing date: ${dateToTest.toLocaleString()}`)
    console.log(`Date TZ: ${dateToTest}`)
    console.log(`Date TZ offset: ${dateToTest.getTimezoneOffset()}`)

    // Get bank holiday data
    const { payload } = await Wreck.get('https://www.gov.uk/bank-holidays.json', {
      json: true,
      rejectUnauthorized: false
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
