// Taken from https://github.com/OrdnanceSurvey/os-transform/blob/main/os-transform.js

const bngToNgr = (point) => {
  const prefixes = [
    ['SV', 'SW', 'SX', 'SY', 'SZ', 'TV', 'TW'],
    ['SQ', 'SR', 'SS', 'ST', 'SU', 'TQ', 'TR'],
    ['SL', 'SM', 'SN', 'SO', 'SP', 'TL', 'TM'],
    ['SF', 'SG', 'SH', 'SJ', 'SK', 'TF', 'TG'],
    ['SA', 'SB', 'SC', 'SD', 'SE', 'TA', 'TB'],
    ['NV', 'NW', 'NX', 'NY', 'NZ', 'OV', 'OW'],
    ['NQ', 'NR', 'NS', 'NT', 'NU', 'OQ', 'OR'],
    ['NL', 'NM', 'NN', 'NO', 'NP', 'OL', 'OM'],
    ['NF', 'NG', 'NH', 'NJ', 'NK', 'OF', 'OG'],
    ['NA', 'NB', 'NC', 'ND', 'NE', 'OA', 'OB'],
    ['HV', 'HW', 'HX', 'HY', 'HZ', 'JV', 'JW'],
    ['HQ', 'HR', 'HS', 'HT', 'HU', 'JQ', 'JR'],
    ['HL', 'HM', 'HN', 'HO', 'HP', 'JL', 'JM']
  ]

  const x = Math.floor(point[0] / 100000)
  const y = Math.floor(point[1] / 100000)

  const prefix = prefixes[y][x]

  let e = Math.floor(point[0] % 100000)
  let n = Math.floor(point[1] % 100000)

  e = String(e).padStart(5, '0')
  n = String(n).padStart(5, '0')

  const text = prefix + ' ' + e + ' ' + n
  const html = prefix + '&thinsp' + e + '&thinsp' + n

  return { text, html, letters: prefix, eastings: e, northings: n }
}

export default bngToNgr
