const formatTime = (input) => {
  const cleanInput = input.toString().trim().toLowerCase().replace(/\s+/g, '')
  const ampmMatch = cleanInput.match(/(am|pm)$/)
  const ampm = ampmMatch ? ampmMatch[1] : null
  const stripped = ampm ? cleanInput.slice(0, -ampm.length) : cleanInput
  const normalised = stripped.replace(/[.,;\-h]/g, ':')

  const parseParts = (str) => {
    if (/^\d{3,4}$/.test(str)) {
      return str.length === 3
        ? [parseInt(str[0], 10), parseInt(str.slice(1), 10)]
        : [parseInt(str.slice(0, 2), 10), parseInt(str.slice(2), 10)]
    }
    if (str.includes(':')) {
      const [h, m] = str.split(':')
      return [parseInt(h, 10), parseInt(m, 10)]
    }
    return [NaN, NaN]
  }

  let [hours, minutes] = parseParts(normalised)

  if (
    isNaN(hours) || isNaN(minutes) ||
    hours > 23 || minutes > 59
  ) return 'INVALID'

  hours = ampm === 'am' && hours === 12
    ? 0
    : ampm === 'pm' && hours < 12
      ? hours + 12
      : hours

  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')

  return `${hours % 12 || 12}:${mm}${hours < 12 ? 'am' : 'pm'}`
}

export {
formatTime
}
