import { getJson } from '../utils/util.js'

const PUBLIC_REGISTER_URL = 'https://environment.data.gov.uk/public-register'
const REGISTERS = [
  'industrial-installations',
  'waste-operations',
  'end-of-life-vehicles'
]
const SEARCH_RADIUS_KM = 5
const MAX_RESULTS = 2000

const searchRegister = async (register, query) => {
  try {
    const response = await getJson(`${PUBLIC_REGISTER_URL}/${register}/registration.json?${query}`, true)
    console.log(`Public register raw response (${register}):`, JSON.stringify(response, null, 2))
    return response.items
  } catch (e) {
    console.log(`Error occurred while calling public register api for ${register}` + e)
    return []
  }
}

const findSitesNearby = async (easting, northing) => {
  const query = new URLSearchParams({
    easting: Math.round(easting),
    northing: Math.round(northing),
    dist: SEARCH_RADIUS_KM,
    _limit: MAX_RESULTS
  })
  const items = (await Promise.all(REGISTERS.map(register => searchRegister(register, query)))).flat()

  const sites = new Map()
  items
    .sort((a, b) => a.distance - b.distance)
    .forEach(item => {
      const name = item.site?.siteAddress?.organization_name || item.holder?.name
      const address = item.site?.siteAddress?.address || ''
      const { easting, northing } = item.site?.location || {}
      const key = `${name}|${address}`
      if (name && !sites.has(key)) {
        // registration numbers are not unique across registers, so use the item URI
        sites.set(key, { id: item['@id'], name, address, easting, northing })
      }
    })
  return [...sites.values()]
}

export {
  findSitesNearby
}
