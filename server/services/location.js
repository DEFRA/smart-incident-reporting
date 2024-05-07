import config from '../utils/config.js'
import { getJson } from '../utils/util.js'

const findByQuery = async query => {
  const uri = `https://api.os.uk/search/names/v1/find?query=${query}&key=${config.osKey}&maxresults=20&fq=LOCAL_TYPE:Postcode LOCAL_TYPE:City LOCAL_TYPE:Town LOCAL_TYPE:Village LOCAL_TYPE:Other_Settlement LOCAL_TYPE:Hamlet LOCAL_TYPE:Suburban_Area`
  const payload = await getJson(uri)

  if (!payload.results || payload.results.length === 0) {
    return {}
  }

  // Strip out any non England results
  return payload.results.find(item => item.GAZETTEER_ENTRY.COUNTRY === 'England')
}

const findSuggestionsByQuery = async query => {
  const uri = `https://api.os.uk/search/names/v1/find?query=${query}&key=${config.osKey}&maxResults=100&fq=LOCAL_TYPE:Postcode LOCAL_TYPE:City LOCAL_TYPE:Town LOCAL_TYPE:Village LOCAL_TYPE:Other_Settlement LOCAL_TYPE:Hamlet LOCAL_TYPE:Suburban_Area`
  const payload = await getJson(uri)

  if (!payload.results || payload.results.length === 0) {
    return []
  }

  // Strip out any non England results
  return payload.results.filter(item => {
    return (item.GAZETTEER_ENTRY.COUNTRY === 'England' && item.GAZETTEER_ENTRY.NAME1.toLowerCase().replaceAll(' ', '').includes(query.toLowerCase().replaceAll(' ', '')))
  })
}

export {
  findByQuery,
  findSuggestionsByQuery
}
