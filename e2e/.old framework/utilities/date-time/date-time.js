class DateTime {
  // Generates a random date/time for yesterday
  async generateYesterdayDateRandomTime () {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const day = String(yesterday.getDate()).padStart(2, '0') // Format day as 2 digits
    const month = String(yesterday.getMonth() + 1).padStart(2, '0') // Format month as 2 digits
    const year = yesterday.getFullYear()
    const hour = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0') // Random hour 1-12
    const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0') // Random minute 0-59
    const period = Math.random() < 0.5 ? 'am' : 'pm' // Randomly choose AM or PM

    // console.log(`Random DateTime: ${day}-${month}-${year} ${hour}:${minute} ${period}`);
    return { day, month, year, hour, minute, period }
  }

  // Generates the current date and time
  async generateCurrentDateCurrentTime () {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0') // Format day as 2 digits
    const month = String(now.getMonth() + 1).padStart(2, '0') // Format month as 2 digits
    const year = now.getFullYear()
    const hour = String(now.getHours() % 12 || 12).padStart(2, '0') // Convert 24-hour to 12-hour format
    const minute = String(now.getMinutes()).padStart(2, '0') // Format minutes as 2 digits
    const period = now.getHours() >= 12 ? 'am' : 'pm' // Determine AM/PM

    // console.log(`Current DateTime: ${day}-${month}-${year} ${hour}:${minute} ${period}`);
    return { day, month, year, hour, minute, period }
  }

  async generateCurrentDatePastTime (min) {
    // Get current date and time
    const now = new Date()

    // Subtract the specified minutes
    now.setMinutes(now.getMinutes() - min)

    // Extract the date and time components
    const day = now.getDate()
    const month = now.getMonth() + 1 // Month is zero-based
    const year = now.getFullYear()
    let hour = now.getHours()
    const minute = now.getMinutes()
    const period = hour >= 12 ? 'pm' : 'am'
    hour = hour % 12 || 12 // Convert to 12-hour format

    //   console.log(`Past datetime is: ${day}/${month}/${year} ${hour}:${minute} ${period}`);
    return { day, month, year, hour, minute, period }
  }
}

export default new DateTime()
