import { formatTime } from '../time-helpers.js'

describe('formatTime', () => {
  // ---- Special keywords ----
  it('Should handle "noon"', () => {
    expect(formatTime('noon')).toBe('12:00pm')
    expect(formatTime('noon', '24hr')).toBe('12:00')
  })

  it('Should handle "midnight"', () => {
    expect(formatTime('midnight')).toBe('12:00am')
    expect(formatTime('midnight', '24hr')).toBe('00:00')
  })

  it('Should handle "12noon" and "12midday"', () => {
    expect(formatTime('12noon')).toBe('12:00pm')
    expect(formatTime('12midday')).toBe('12:00pm')
  })

  it('Should handle "12midnight"', () => {
    expect(formatTime('12midnight')).toBe('12:00am')
    expect(formatTime('12midnight', '24hr')).toBe('00:00')
  })

  // ---- AM/PM suffix ----
  it('Should handle AM/PM variations', () => {
    expect(formatTime('5am')).toBe('5:00am')
    expect(formatTime('5 a.m.')).toBe('5:00am')
    expect(formatTime('5 p m')).toBe('5:00pm')
    expect(formatTime('11 pm')).toBe('11:00pm')
  })

  it('Should handle 12am and 12pm edge cases', () => {
    expect(formatTime('12am')).toBe('12:00am') // midnight
    expect(formatTime('12pm')).toBe('12:00pm') // noon
  })

  // ---- 24-hour style ----
  it('Should handle 24hr valid inputs', () => {
    expect(formatTime('00:00', '24hr')).toBe('00:00')
    expect(formatTime('23:59', '24hr')).toBe('23:59')
    expect(formatTime('09:05', '24hr')).toBe('09:05')
    expect(formatTime('21:30', '24hr')).toBe('21:30')
    expect(formatTime('15', '24hr')).toBe('15:00')
  })

  it('Should reject invalid 24hr inputs', () => {
    expect(formatTime('24:00', '24hr')).toBe('INVALID_TIME_FORMAT')
    expect(formatTime('25:10', '24hr')).toBe('INVALID_TIME_FORMAT')
    expect(formatTime('12:60', '24hr')).toBe('INVALID_TIME_FORMAT')
  })

  // ---- Compact formats ----
  it('Should handle compact HHMM format', () => {
    expect(formatTime('2359', '24hr')).toBe('23:59')
    expect(formatTime('0815', '24hr')).toBe('08:15')
  })

  it('Should handle compact HMM format with AM/PM', () => {
    expect(formatTime('915am')).toBe('9:15am')
    expect(formatTime('915pm')).toBe('9:15pm')
  })

  it('Should reject compact HMM without AM/PM', () => {
    expect(formatTime('915')).toBe('INVALID_TIME_FORMAT')
  })

  // ---- Separators ----
  it('Should normalize different separators', () => {
    expect(formatTime('5.30pm')).toBe('5:30pm')
    expect(formatTime('5-30pm')).toBe('5:30pm')
    expect(formatTime('5;30pm')).toBe('5:30pm')
    expect(formatTime('5,30pm')).toBe('5:30pm')
    expect(formatTime('5h30pm')).toBe('5:30pm')
    expect(formatTime('5 30 pm')).toBe('5:30pm')
  })

  // ---- Hour only inputs ----
  it('Should handle hour-only with AM/PM', () => {
    expect(formatTime('5am')).toBe('5:00am')
    expect(formatTime('10pm')).toBe('10:00pm')
  })

  it('Should reject ambiguous hour-only without AM/PM', () => {
    expect(formatTime('5')).toBe('INVALID_TIME_FORMAT')
  })

  // ---- Invalid formats ----
  it('Should reject completely invalid inputs', () => {
    expect(formatTime('')).toBe('INVALID_TIME_FORMAT')
    expect(formatTime('notatime')).toBe('INVALID_TIME_FORMAT')
    expect(formatTime('99pm')).toBe('INVALID_TIME_FORMAT')
    expect(formatTime('1260')).toBe('INVALID_TIME_FORMAT')
  })

  // ---- Edge cases ----
  it('Should trim spaces and lowercase input', () => {
    expect(formatTime(' NOON ')).toBe('12:00pm')
  })

  it('Should handle single digit hour with leading zero', () => {
    expect(formatTime('07:05am')).toBe('7:05am')
  })

  it('Should reject invalid separator "/"', () => {
    expect(formatTime('12/30pm')).toBe('INVALID_TIME_FORMAT')
  })

  it('Should reject "am" without an hour', () => {
    expect(formatTime('am')).toBe('INVALID_TIME_FORMAT')
  })

  it('Should reject "pm" without an hour', () => {
    expect(formatTime('pm')).toBe('INVALID_TIME_FORMAT')
  })
})
