import config from '../utils/config.js'
import { getJson } from '../utils/util.js'

const localityTypes = [
  'Postcode',
  'City',
  'Town',
  'Village',
  'Other_Settlement',
  'Hamlet',
  'Suburban_Area',
  'Named_Road',
  'Numbered_Road',
  'Channel',
  'Inland_Water',
  'Sea',
  'Beach',
  'Hill_Or_Mountain',
  'Woodland_Or_Forest',
  'Electricity_Production'
]

const fullLocalTypeFilter = 'LOCAL_TYPE:Postcode LOCAL_TYPE:City LOCAL_TYPE:Town LOCAL_TYPE:Village LOCAL_TYPE:Other_Settlement LOCAL_TYPE:Hamlet LOCAL_TYPE:Suburban_Area LOCAL_TYPE:Named_Road LOCAL_TYPE:Numbered_Road LOCAL_TYPE:Channel LOCAL_TYPE:Inland_Water LOCAL_TYPE:Sea LOCAL_TYPE:Beach LOCAL_TYPE:Hill_Or_Mountain LOCAL_TYPE:Woodland_Or_Forest LOCAL_TYPE:Electricity_Production'

const findByQuery = async query => {
  const uri = `https://api.os.uk/search/names/v1/find?query=${query}&key=${config.osKey}&maxResults=100&fq=${fullLocalTypeFilter}`
  const payload = await getJson(uri)

  if (!payload.results || payload.results.length === 0) {
    return {}
  }

  // Strip out any non England results
  return payload.results.find(item => item.GAZETTEER_ENTRY.COUNTRY === 'England') || {}
}

const findSuggestionsByQuery = async query => {
  const uri = `https://api.os.uk/search/names/v1/find?query=${query}&key=${config.osKey}&maxResults=100&fq=${fullLocalTypeFilter}`
  const payload = await getJson(uri)

  if (!payload.results || payload.results.length === 0) {
    return []
  }

  // Strip out any non England results
  return payload.results.filter(item => {
    return (item.GAZETTEER_ENTRY.COUNTRY === 'England' && item.GAZETTEER_ENTRY.NAME1.toLowerCase().replaceAll(' ', '').includes(query.toLowerCase().replaceAll(' ', '')))
  })
}

const findSuggestionsByQueryAndLocalityType = async (query, localityType) => {
  const fq = localityTypes.includes(localityType)
    ? `LOCAL_TYPE:${localityType}`
    : fullLocalTypeFilter

  const uri = `https://api.os.uk/search/names/v1/find?query=${query}&key=${config.osKey}&maxResults=100&fq=${fq}`
  const payload = await getJson(uri)

  if (!payload.results || payload.results.length === 0) {
    return []
  }

  // fq already restricts to the selected locality type; mirror findByQuery and only filter by country
  return payload.results.filter(item => item.GAZETTEER_ENTRY.COUNTRY === 'England')
}

export {
  localityTypes,
  findByQuery,
  findSuggestionsByQuery,
  findSuggestionsByQueryAndLocalityType
}
