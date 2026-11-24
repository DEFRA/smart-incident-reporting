import { getJson } from '../utils/util.js'

const PUBLIC_REGISTER_URL = 'https://environment.data.gov.uk/public-register'
const REGISTERS = [
  'industrial-installations',
  'waste-operations'
]
const SEARCH_RADIUS_KM = 3
const MAX_RESULTS = 2000

const searchRegister = async (register, query) => {
  try {
    const { items } = await getJson(`${PUBLIC_REGISTER_URL}/${register}/registration.json?${query}`, true)
    return { items }
  } catch (e) {
    console.log(`Error occurred while calling public register api for ${register}` + e)
    return { items: [], failed: true }
  }
}

// the town or city is what remains of the full address after the street address and the trailing postcode are removed
const getTown = ({ address = '', street_address: streetAddress = '', postcode = '' } = {}) => {
  let town = address
  if (streetAddress && town.startsWith(streetAddress)) {
    town = town.slice(streetAddress.length)
  }
  if (postcode && town.endsWith(postcode)) {
    town = town.slice(0, -postcode.length)
  }
  return town.replace(/^[\s,]+|[\s,]+$/g, '')
}

// the api returns a single object instead of an array when there is only one activity
const getPrimaryActivity = activity => [activity ?? []].flat()
  .find(({ primaryActivityFlag }) => primaryActivityFlag === 1)?.comment || ''

// mobile plant permits have no fixed site address
const isMobilePlant = siteAddress => /mobile plant/i.test(siteAddress?.street_address || '')

const findSitesNearby = async (easting, northing) => {
  const query = new URLSearchParams({
    easting: Math.round(easting),
    northing: Math.round(northing),
    dist: SEARCH_RADIUS_KM,
    _limit: MAX_RESULTS
  })
  const results = await Promise.all(REGISTERS.map(register => searchRegister(register, query)))
  const items = results.flatMap(result => result.items)
  const apiDown = results.some(result => result.failed)

  const sites = new Map()
  items
    .sort((a, b) => a.distance - b.distance)
    .forEach(item => {
      const siteAddress = item.site?.siteAddress
      const name = item.holder?.name || siteAddress?.organization_name
      const address = siteAddress?.address || ''
      const key = `${name}|${address}`
      if (name && !isMobilePlant(siteAddress) && !sites.has(key)) {
        // registration numbers are not unique across registers, so use the item URI
        sites.set(key, {
          id: item['@id'],
          name,
          address,
          streetAddress: siteAddress?.street_address || '',
          town: getTown(siteAddress),
          postcode: siteAddress?.postcode || '',
          registrationNumber: item.registrationNumber || '',
          primaryActivity: getPrimaryActivity(item.activity),
          distance: item.distance
        })
      }
    })
  return { sites: [...sites.values()], apiDown }
}

export {
  findSitesNearby
}
