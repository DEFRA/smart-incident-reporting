import fetch from 'node-fetch'

export default class Authentication {
  async authenticate () {
    // OAuth token endpoint
    const tokenUrl = process.env.TOKEN_URL
    // OAuth client credentials
    const clientId = process.env.CLIENT_ID
    const clientSecret = process.env.CLIENT_SECRET

    // Ensure CLIENT_ID and CLIENT_SECRET are set
    if (!clientId || !clientSecret) {
      throw new Error('Please set CLIENT_ID and CLIENT_SECRET environment variables.')
    }

    // OAuth token request parameters
    const data = {
      grant_type: 'client_credentials',
      scope: process.env.SCOPE
    }

    // OAuth token request headers
    const headers = {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    // Making a POST request with fetch to get OAuth token
    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers,
        body: new URLSearchParams(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      const accessToken = responseData.access_token
      console.log('Authentication successful. Access token:', accessToken)
      return accessToken
    } catch (error) {
      console.error('Error:', error)
      return null
    }
  }

  // Perform the API request with the obtained access token
  async fetchData (accessTokenToUse, dataverseURL) {
    try {
      // Make the API request with the access token
      const response = await fetch(dataverseURL, {
        headers: {
          Authorization: `Bearer ${accessTokenToUse}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('access token is: ' + accessTokenToUse)

      // Extract sbs_jsoninsert from each payload
      const sbsJsons = data.value.map(item => item.sbs_jsoninsert)

      // Log the extracted sbs_jsonsinsert
      console.log('Extracted sbs_jsoninsert:', sbsJsons)

      // Return the extracted sbs_jsons
      return sbsJsons
    } catch (error) {
      console.log('access token is: ' + accessTokenToUse)
      console.error('API request error:', error.message)
      throw error
    }
  }

  async fetchDataVerse (accessTokenToUse, dataverseURL) {
    try {
      // Make the API request with the access token
      const response = await fetch(dataverseURL, {
        headers: {
          Authorization: `Bearer ${accessTokenToUse}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('RAW DATA:: ', data)
      return data.value[0].sbs_reportid
    } catch (error) {
      console.log('access token is: ' + accessTokenToUse)
      console.error('API request error:', error.message)
      throw error
    }
  }

  // async fetchFeedbackData(accessTokenToUse, dataverseURL) {
  //     try {
  //         // Make the API request with the access token
  //         const response = await axios.get(dataverseURL, {
  //             headers: {
  //                 'Authorization': `Bearer ${accessTokenToUse}`
  //             }
  //         });

  //         // Extract and return the data property from the response
  //         return response.data;
  //     } catch (error) {
  //         console.error('API request error:', error.message);
  //         throw error;
  //     }
  // }

  async fetchFeedbackData (accessTokenToUse, dataverseURL) {
    try {
      const response = await fetch(dataverseURL, {
        headers: {
          Authorization: `Bearer ${accessTokenToUse}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Check if the response contains any data
      if (data && data.value && data.value.length > 0) {
        // Assuming only one record is returned, so taking the statuscode of the first record
        const statusCode = data.value[0].statuscode
        return statusCode
      } else {
        console.error('No data found in the response:', data)
        throw new Error('No data found in the response')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error // Rethrow the error to handle it elsewhere if needed
    }
  }
}

// console.log("going to run the query now: ")
// Run the authentication and data fetching
// Call the authenticate function
// authenticate().then((accessTokenToUse) => fetchData(accessTokenToUse))

// authenticate().then(tokenmy => {return fetchData(tokenmy)}).catch(error => {console.error('error has occured', error)})
