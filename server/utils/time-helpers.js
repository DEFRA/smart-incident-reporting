const formatTime = (input, format = '12hr') => {
  const raw = String(input).trim()
  if (!raw) return 'INVALID_TIME_FORMAT'
  let str = raw.toLowerCase()

  // ---- Special words (handled first) ----
  const specials = new Map([
    ['noon', { h: 12, m: 0 }],
    ['midday', { h: 12, m: 0 }],
    ['12noon', { h: 12, m: 0 }],
    ['12midday', { h: 12, m: 0 }],
    ['midnight', { h: 0, m: 0 }],
    ['12midnight', { h: 0, m: 0 }]
  ])

  {
    const key = str.replace(/\s+/g, '')
    if (specials.has(key)) {
      const { h, m } = specials.get(key)
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      if (format === '24hr') return `${hh}:${mm}`
      const h12 = (h % 12) || 12
      const suffix = h < 12 ? 'am' : 'pm'
      return `${h12}:${mm}${suffix}`
    }
  }

  // ---- Extract AM/PM (am, a.m., a m, .am, etc.) at the end ----
  // Allow punctuation/spaces right before suffix but disallow real time separators
  const suffixMatch = /([ap])\s{0,3}\.?\s{0,3}m\.?\s*$/i.exec(str)
  let ampm = null

  if (suffixMatch !== null) {
    ampm = suffixMatch[1].toLowerCase() === 'a' ? 'am' : 'pm'
    const before = str.slice(0, suffixMatch.index)

    // Reject if before ends with true time separator, meaning minutes missing
    if (/[h:]\s*$/i.test(before)) return 'INVALID_TIME_FORMAT'

    // Trim cosmetic punctuation/spaces before suffix
    str = before.replace(/[.,;\-\s]{1,10}$/g, '')
    if (!str) return 'INVALID_TIME_FORMAT' // e.g., '.am' or '- pm' with no time
  }

  // ---- Remove trailing 'hr/hrs/hour/hours' (cosmetic) ----
  str = str.replace(/\b(hours?|hrs?)\b\s*$/i, '')

  // ---- Normalise separators: ., , ;, - , h  -> ':' ----
  str = str.replace(/[.,;-]/g, ':').replace(/h/gi, ':')

  // Digit space digit -> colon (e.g., '5 15' -> '5:15'); then remove remaining spaces
  str = str.replace(/(\d)\s+(\d)/g, '$1:$2').replace(/\s+/g, '')

  // ---- Parse into hours/minutes ----
  let hours
  let minutes

  if (/^\d{1,2}$/.test(str)) {
    // Hour only
    hours = Number.parseInt(str, 10)
    minutes = 0

    // Ambiguity rule: without AM/PM, a 1–2 digit hour must be clearly 24-hour
    if (!ampm) {
      if (str.length === 1) return 'INVALID_TIME_FORMAT'
      if (str.length === 2) {
        const leadingZero = str[0] === '0'
        if (!(leadingZero || hours >= 10)) return 'INVALID_TIME_FORMAT'
      }
    }
  } else if (/^\d{4}$/.test(str)) {
    // Compact HHMM (24-hour)
    hours = Number.parseInt(str.slice(0, 2), 10)
    minutes = Number.parseInt(str.slice(2), 10)
  } else if (/^\d{3}$/.test(str)) {
    // Compact HMM -> ONLY with AM/PM
    if (!ampm) return 'INVALID_TIME_FORMAT'
    hours = Number.parseInt(str[0], 10)
    minutes = Number.parseInt(str.slice(1), 10)
  } else if (/^\d{1,2}:\d{1,2}$/.test(str)) {
    // With a separator
    const [h, mi] = str.split(':')
    hours = Number.parseInt(h, 10)
    minutes = Number.parseInt(mi, 10)
  } else {
    return 'INVALID_TIME_FORMAT'
  }

  // ---- Validate numeric ranges ----
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 'INVALID_TIME_FORMAT'
  if (minutes < 0 || minutes > 59) return 'INVALID_TIME_FORMAT'

  if (ampm) {
    // 12-hour range
    if (hours < 1 || hours > 12) return 'INVALID_TIME_FORMAT'
    if (ampm === 'am' && hours === 12) hours = 0 // 12:xx AM -> 00:xx
    if (ampm === 'pm' && hours < 12) hours += 12 // 1..11 PM -> 13..23
  } else {
    // 24-hour range
    if (hours < 0 || hours > 23) return 'INVALID_TIME_FORMAT'
  }

  // ---- Format output ----
  if (format === '24hr') {
    const hh = String(hours).padStart(2, '0')
    const mm = String(minutes).padStart(2, '0')
    return `${hh}:${mm}`
  }

  const hh12 = String(hours % 12 || 12)
  const mm = String(minutes).padStart(2, '0')
  const suffix = hours < 12 ? 'am' : 'pm'
  return `${hh12}:${mm}${suffix}`
}

export {
  formatTime
}
