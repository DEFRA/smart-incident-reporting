import config from '../utils/config.js'
import { getJson } from '../utils/util.js'

const findByPostcode = async (postcode) => {
  try {
    const uri = `https://api.os.uk/search/places/v1/postcode?postcode=${postcode}&key=${config.osKey}&lr=EN&fq=logical_status_code:1 logical_status_code:6&dataset=DPA&offset=0&maxresults=100`
    const payload = await getJson(uri, true)
    return {
      payload
    }
  } catch (e) {
    console.log('Error occurred while calling os data hub api' + e)

    return {
      payload: {
        header: {
          totalresults: 0
        }
      }
    }
  }
}

export {
  findByPostcode
}
