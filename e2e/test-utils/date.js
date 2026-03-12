import dayjs from 'dayjs'

export function pastTimeToday (minutesAgo = 10) {
  const now = dayjs()
  const minutesSinceMidnight = now.hour() * 60 + now.minute()

  if (minutesSinceMidnight === 0) {
    return '12:00am'
  }

  const safeDelta = Math.min(Math.max(1, minutesAgo), minutesSinceMidnight)
  return now.subtract(safeDelta, 'minute').format('hh:mma')
}
