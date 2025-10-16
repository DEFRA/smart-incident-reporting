const INVALID = 'INVALID_TIME_FORMAT'

// ---- Constants (avoid magic numbers) ----
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

// ---- Normalise separators ----
// Converts ".", ",", ";", "-", "h", spaces into ":" consistently
const normalizeSeparators = (str) => {
  return str
    .replace(/\b(hours?|hrs?)\b\s*$/i, '') // Remove "hours/hrs" suffix
    .replace(/[.,;-]/g, ':') // Replace separators with ":"
    .replace(/h/gi, ':') // Replace h/H with ":"
    .replace(/(\d)\s+(\d)/g, '$1:$2') // Convert "5 15" → "5:15"
    .replace(/\s+/g, '') // Remove remaining spaces
}

// ---- Parse special keywords (noon, midnight etc.) ----
const parseSpecialKeyword = (str, format) => {
  const key = str.replace(/\s+/g, '')
  if (!specials.has(key)) {
    return null
  }

  const { h, m } = specials.get(key)
  const hh = String(h).padStart(2, '0')
  const minutesStr = String(m).padStart(2, '0')

  if (format === '24hr') {
    return `${hh}:${minutesStr}`
  }

  const h12 = h % HOUR_12 || HOUR_12
  const specialSuffix = h < HOUR_12 ? 'am' : 'pm'
  return `${h12}:${minutesStr}${specialSuffix}`
}

// ---- Extract AM/PM (am, a.m., a m, etc.) ----
const extractAmPm = (str) => {
  const match = /([ap])\s{0,3}\.?\s{0,3}m\.?\s*$/i.exec(str)
  if (!match) {
    return { ampm: null, timePart: str }
  }

  const ampm = match[1].toLowerCase() === 'a' ? 'am' : 'pm'
  const before = str.slice(0, match.index)

  // Reject if before ends with a true time separator, meaning minutes missing
  if (/[h:]\s*$/i.test(before)) {
    return { ampm: null, timePart: null }
  }

  // Trim punctuation/spaces before suffix
  const timePart = before.replace(/[.,;\-\s]{1,10}$/g, '')
  if (!timePart) {
    return { ampm: null, timePart: null }
  }

  return { ampm, timePart }
}

// ---- Hour/minute parsing helpers ----

// Parse hour-only input like "09" or "5"
const parseHourOnly = (str, ampm) => {
  const hours = Number.parseInt(str, 10)
  const minutes = 0

  if (ampm) {
    return { hours, minutes }
  }

  if (str.length === 1) {
    return null
  }

  if (str.length === 2) {
    const leadingZero = str.startsWith('0')
    if (!leadingZero && hours < 10) {
      return null
    }
  }

  return { hours, minutes }
}

// Parse compact 4-digit HHMM
const parseFourDigit = (str) => {
  return {
    hours: Number.parseInt(str.slice(0, 2), 10),
    minutes: Number.parseInt(str.slice(2), 10)
  }
}

// Parse compact 3-digit HMM (now valid with or without AM/PM)
const parseThreeDigit = (str) => {
  return {
    hours: Number.parseInt(str[0], 10),
    minutes: Number.parseInt(str.slice(1), 10)
  }
}

// Parse input with colon separator (H:M)
const parseWithColon = (str) => {
  const [h, m] = str.split(':')
  return {
    hours: Number.parseInt(h, 10),
    minutes: Number.parseInt(m, 10)
  }
}

// ---- Parse into hours/minutes ----
const parseHourMinute = (str, ampm) => {
  if (/^\d{1,2}$/.test(str)) {
    return parseHourOnly(str, ampm)
  }

  if (/^\d{4}$/.test(str)) {
    return parseFourDigit(str)
  }

  if (/^\d{3}$/.test(str)) {
    return parseThreeDigit(str) // no longer requires ampm
  }

  if (/^\d{1,2}:\d{1,2}$/.test(str)) {
    return parseWithColon(str)
  }

  return null
}

// ---- Validate numeric ranges ----

// Validate AM/PM style times
const validateAmPmTime = (hours, minutes, ampm) => {
  if (hours < 1 || hours > HOUR_12) {
    return null
  }

  let validHours = hours
  if (ampm === 'am' && hours === HOUR_12) {
    validHours = 0
  }
  if (ampm === 'pm' && hours < HOUR_12) {
    validHours += HOUR_12
  }

  return { hours: validHours, minutes }
}

// Validate 24-hour style times
const validate24HrTime = (hours, minutes) => {
  if (hours < 0 || hours > HOUR_24_MAX) {
    return null
  }
  return { hours, minutes }
}

// Combined validator
const validateTime = (hours, minutes, ampm) => {
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null
  }

  if (minutes < 0 || minutes > MINUTES_MAX) {
    return null
  }

  if (ampm) {
    return validateAmPmTime(hours, minutes, ampm)
  }

  return validate24HrTime(hours, minutes)
}

// ---- Format output ----
const formatOutput = (hours, minutes, format) => {
  const hh = format === '24hr'
    ? String(hours).padStart(2, '0')
    : String(hours % HOUR_12 || HOUR_12)

  const minutesStr = String(minutes).padStart(2, '0')

  if (format === '24hr') {
    return `${hh}:${minutesStr}`
  }

  const timeSuffix = hours < HOUR_12 ? 'am' : 'pm'
  return `${hh}:${minutesStr}${timeSuffix}`
}

// ---- Main entry ----
const formatTime = (input, format = '12hr') => {
  const raw = String(input).trim()
  if (!raw) {
    return INVALID
  }

  const lower = raw.toLowerCase()

  // Step 1: check for special keywords
  const special = parseSpecialKeyword(lower, format)
  if (special) {
    return special
  }

  // Step 2: extract AM/PM
  const { ampm, timePart } = extractAmPm(lower)
  if (timePart === null) {
    return INVALID
  }

  // Step 3: normalize separators
  const normal = normalizeSeparators(timePart)

  // Step 4: parse into hours/minutes
  const parsed = parseHourMinute(normal, ampm)
  if (!parsed) {
    return INVALID
  }

  // ---- Ambiguity check: only for 12hr format without AM/PM ----
  if (!ampm && format === '12hr') {
    if (parsed.hours >= 1 && parsed.hours <= 11) {
      const isFourDigitWithLeadingZero = /^\d{4}$/.test(timePart) && timePart.startsWith('0')

      if (!isFourDigitWithLeadingZero) {
        // If it's not 0515 (with leading zero), reject as ambiguous
        return INVALID
      }
    }
  }

  // Step 5: validate ranges
  const validated = validateTime(parsed.hours, parsed.minutes, ampm)
  if (!validated) {
    return INVALID
  }

  // Step 6: format result
  return formatOutput(validated.hours, validated.minutes, format)
}

export {
  formatTime
}
