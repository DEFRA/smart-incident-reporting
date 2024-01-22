// import location from '../../../server/services/location.js'
// import util from '../../utils/util.js'

// jest.mock('../../../server/utils/util', () => ({
//   getJson: jest.fn()
// }))

// describe('OrdnanceService', () => {
//   describe('findByPostcode', () => {
//     it('should return the coordinates for a valid postcode', async () => {
//       // Mock the util.getJson function
//       util.getJson.mockResolvedValueOnce({
//         results: [
//           {
//             DPA: {
//               X_COORDINATE: 1.234,
//               Y_COORDINATE: 2.234
//             }
//           }
//         ]
//       })

//       // Call the function
//       const result = await location.findByPostcode('12345')

//       const expectedResults = {
//         X_COORDINATE: 1.234,
//         Y_COORDINATE: 2.234
//       }

//       // Assert the result
//       expect(result).toEqual(expectedResults)

//       // Assert the util.getJson function call
//       expect(util.getJson).toHaveBeenCalledTimes(1)
//       expect(util.getJson).toHaveBeenCalledWith('https://api.os.uk/search/places/v1/postcode?postcode=12345&key=testKey')
//     })

//     // it('should return default coordinates for an invalid postcode', async () => {
//     //   // Mock the util.getJson function to throw an error
//     //   util.getJson.mockRejectedValueOnce(new Error('Invalid postcode'))

//     //   // Call the function
//     //   const result = await location.findByPostcode('invalid')

//     //   // Assert the result
//     //   expect(result).toEqual({
//     //     X_COORDINATE: 51.5,
//     //     Y_COORDINATE: 0.0293
//     //   })

//     //   // Assert the util.getJson function call
//     //   expect(util.getJson).toHaveBeenCalledTimes(1)
//     //   expect(util.getJson).toHaveBeenNthCalledWith(1, 'https://api.os.uk/search/places/v1/postcode?postcode=invalid&key=testKey')
//     // })
//   })
// })
