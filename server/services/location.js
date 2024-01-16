import config from '../utils/config.js'
import { getJson } from '../utils/util.js'

const findByQuery = async query => {
  try {
    const uri = `https://api.os.uk/search/names/v1/find?query=${query}&key=${config.osKey}&maxresults=1`
    const payload = await getJson(uri)

    if (!payload.results || payload.results.length === 0) {
      throw new Error('No location results found')
    }

    return [
      payload.results[0].GAZETTEER_ENTRY.GEOMETRY_X,
      payload.results[0].GAZETTEER_ENTRY.GEOMETRY_Y,
    ]

  } catch (err) {
    throw(err)
  }
}
export {
  findByQuery
}
