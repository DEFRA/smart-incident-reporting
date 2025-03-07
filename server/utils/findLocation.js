import { getJson } from './util.js'

const apiKey = '***API Key***'
export default {
  findByPostcode: async postcode => {
    try {
      const uri = `https://api.os.uk/search/places/v1/postcode?postcode=${postcode}&key=${apiKey}&lr=EN&fq=logical_status_code:1 logical_status_code:6&dataset=DPA&offset=0&maxresults=100`
      const payload = await getJson(uri, true)
      console.log('Data for payload1', payload)

      return {
        payload
      }
    } catch (e) {
      // Assigning a default location x and y, if postcode is not found
      console.log('Error occurred while calling os data hub api' + e)

      return {
        payload : {
          statuscode: 400 
        }
      }
    }
  }
}
