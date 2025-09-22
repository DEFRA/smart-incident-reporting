const INVALID = 'INVALID_TIME_FORMAT'

// ---- Constants (no magic numbers) ----
const HOUR_12 = 12
const MINUTES_MAX = 59
const HOUR_24_MAX = 23

// ---- Special words (handled first) ----
const specials = new Map([
  ['noon', { h: HOUR_12, m: 0 }],
  ['midday', { h: HOUR_12, m: 0 }],
  ['12noon', { h: HOUR_12, m: 0 }],
  ['12midday', { h: HOUR_12, m: 0 }],
  ['midnight', { h: 0, m: 0 }],
  ['12midnight', { h: 0, m: 0 }]
])

// ---- Normalise separators: ., , ;, - , h  -> ':' ----
// Also: digit space digit -> colon (e.g., '5 15' -> '5:15')
// Then remove remaining spaces
const normalizeSeparators = (str) => {
  return str
    // Remove trailing 'hr/hrs/hour/hours' (cosmetic)
    .replace(/\b(hours?|hrs?)\b\s*$/i, '')
    .replace(/[.,;-]/g, ':')
    .replace(/h/gi, ':')
    .replace(/(\d)\s+(\d)/g, '$1:$2')
    .replace(/\s+/g, '')
}

// ---- Parse special keywords (e.g., noon, midnight) ----
const parseSpecialKeyword = (str, format) => {
  const key = str.replace(/\s+/g, '')
  if (!specials.has(key)) return null

  const { h, m } = specials.get(key)
  const hh = String(h).padStart(2, '0')
  const minutesStr = String(m).padStart(2, '0')

  if (format === '24hr') return `${hh}:${minutesStr}`

  const h12 = h % HOUR_12 || HOUR_12
  const specialSuffix = h < HOUR_12 ? 'am' : 'pm'
  return `${h12}:${minutesStr}${specialSuffix}`
}

// ---- Extract AM/PM (am, a.m., a m, .am, etc.) at the end ----
// Allow punctuation/spaces right before suffix but disallow real time separators
const extractAmPm = (str) => {
  const match = /([ap])\s{0,3}\.?\s{0,3}m\.?\s*$/i.exec(str)
  if (!match) return { ampm: null, timePart: str }

  const ampm = match[1].toLowerCase() === 'a' ? 'am' : 'pm'
  const before = str.slice(0, match.index)

  // Reject if before ends with true time separator, meaning minutes missing
  if (/[h:]\s*$/i.test(before)) return { ampm: null, timePart: null }

  // Trim cosmetic punctuation/spaces before suffix
  const timePart = before.replace(/[.,;\-\s]{1,10}$/g, '')
  if (!timePart) {
    // e.g., '.am' or '- pm' with no time
    return { ampm: null, timePart: null }
  }

  return { ampm, timePart }
}

// ---- Hour/minute parsing helpers ----
const parseHourOnly = (str, ampm) => {
  const hours = Number.parseInt(str, 10)
  const minutes = 0

  if (ampm) return { hours, minutes }

  // Ambiguity rule: without AM/PM, a 1–2 digit hour must be clearly 24-hour
  if (str.length === 1) return null
  if (str.length === 2) {
    const leadingZero = str.startsWith('0')
    if (!leadingZero && hours < 10) return null
  }
  return { hours, minutes }
}

const parseFourDigit = (str) => ({
  // Compact HHMM (24-hour)
  hours: Number.parseInt(str.slice(0, 2), 10),
  minutes: Number.parseInt(str.slice(2), 10)
})

const parseThreeDigit = (str, ampm) => {
  // Compact HMM -> ONLY with AM/PM
  if (!ampm) return null
  return {
    hours: Number.parseInt(str[0], 10),
    minutes: Number.parseInt(str.slice(1), 10)
  }
}

const parseWithColon = (str) => {
  // With a separator (e.g., 5:30, 12:05)
  const [h, m] = str.split(':')
  return {
    hours: Number.parseInt(h, 10),
    minutes: Number.parseInt(m, 10)
  }
}

// ---- Parse into hours/minutes ----
const parseHourMinute = (str, ampm) => {
  if (/^\d{1,2}$/.test(str)) return parseHourOnly(str, ampm)
  if (/^\d{4}$/.test(str)) return parseFourDigit(str)
  if (/^\d{3}$/.test(str)) return parseThreeDigit(str, ampm)
  if (/^\d{1,2}:\d{1,2}$/.test(str)) return parseWithColon(str)
  return null
}

// ---- Validate numeric ranges ----
// Always returns either { hours, minutes } or null
const validateAmPmTime = (hours, minutes, ampm) => {
  if (hours < 1 || hours > HOUR_12) return null

  let validHours = hours
  if (ampm === 'am' && hours === HOUR_12) validHours = 0 // 12:xx AM -> 00:xx
  if (ampm === 'pm' && hours < HOUR_12) validHours += HOUR_12 // 1..11 PM -> 13..23

  return { hours: validHours, minutes }
}

const validate24HrTime = (hours, minutes) => {
  if (hours < 0 || hours > HOUR_24_MAX) return null
  return { hours, minutes }
}

const validateTime = (hours, minutes, ampm) => {
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null
  if (minutes < 0 || minutes > MINUTES_MAX) return null
  return ampm ? validateAmPmTime(hours, minutes, ampm) : validate24HrTime(hours, minutes)
}

// ---- Format output ----
const formatOutput = (hours, minutes, format) => {
  const hh = format === '24hr'
    ? String(hours).padStart(2, '0')
    : String(hours % HOUR_12 || HOUR_12)

  const minutesStr = String(minutes).padStart(2, '0')

  if (format === '24hr') return `${hh}:${minutesStr}`

  const timeSuffix = hours < HOUR_12 ? 'am' : 'pm'
  return `${hh}:${minutesStr}${timeSuffix}`
}

// ---- Main entry ----
const formatTime = (input, format = '12hr') => {
  const raw = String(input).trim()
  if (!raw) return INVALID

  const lower = raw.toLowerCase()

  // ---- Special keywords ----
  const special = parseSpecialKeyword(lower, format)
  if (special) return special

  // ---- Extract AM/PM ----
  const { ampm, timePart } = extractAmPm(lower)
  if (timePart === null) return INVALID

  // ---- Normalise separators ----
  const normal = normalizeSeparators(timePart)

  // ---- Parse into hours/minutes ----
  const parsed = parseHourMinute(normal, ampm)
  if (!parsed) return INVALID

  // ---- Validate numeric ranges ----
  const validated = validateTime(parsed.hours, parsed.minutes, ampm)
  if (!validated) return INVALID

  // ---- Format output ----
  return formatOutput(validated.hours, validated.minutes, format)
}

export {
  formatTime
}
