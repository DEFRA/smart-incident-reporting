const util = require('../utils/util')

module.exports = {
  findByPostcode: async (postcode) => {
    try {
      const uri = 'https://api.os.uk/search/places/v1/postcode?postcode=' + postcode + '&key=50br44ij15V5hIAAhLoeFTiY57NZBYHS'
      const payload = await util.getJson(uri)
      return {
        X_COORDINATE: payload.results[0].DPA.X_COORDINATE,
        Y_COORDINATE: payload.results[0].DPA.X_COORDINATE
      }
    } catch (e) {
      // Assigning a default location x and y, if postcode is not found
      console.log('Error occurred while calling os data hub api' + e)
      return {
        X_COORDINATE: 51.5,
        Y_COORDINATE: 0.0293
      }
    }
  }
}