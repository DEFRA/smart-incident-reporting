import { initialiseMap, panToPoint, transformPoint } from '../map'

const locationSearchButton = document.getElementById('search-location')
const locationTextBox = document.getElementById('location')
const currentLocationButton = document.getElementById('current-location')
const mapElement = document.getElementById('map')
const continueButton = document.getElementById('continue')

const searchLocation = async () => {
  const locationString = locationTextBox.value
  const response = await fetch(`/api/location?location=${locationString}`) // eslint-disable-line
  const data = await response.json()
  if (data && Array.isArray(data)) {
    panToPoint(data)
  }
}

const getLocation = async () => {
  const location = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
  return [
    location.coords.longitude,
    location.coords.latitude
  ]
}

/// // Events
locationSearchButton.addEventListener('click', async (e) => {
  e.preventDefault()
  await searchLocation()
})

locationTextBox.addEventListener('keyup', async (e) => {
  e.preventDefault()
  if (e.key === 'Enter') {
    await searchLocation()
  }
})

currentLocationButton.addEventListener('click', async (e) => {
  e.preventDefault()
  if ('geolocation' in navigator) {
    const location = await getLocation()
    panToPoint(transformPoint(location), 1000)
  } else {
    console.log('Geolocation not found in browser')
  }
})

mapElement.addEventListener('click', (e) => {
  continueButton.removeAttribute('disabled')
  continueButton.classList.remove('govuk-button--disabled')
  continueButton.setAttribute('aria-disabled', 'false')
})

// // Map drawing interaction
// const vectorSource = new VectorSource({ wrapX: false })
// const vectorLayer = new VectorLayer({
//   source: vectorSource,
//   style: new Style({
//     image: new Icon({
//       anchor: [0.5, 53],
//       anchorXUnits: 'fraction',
//       anchorYUnits: 'pixels',
//       src: '/public/images/marker-black.png'
//     })
//   })
// })

// const init = () => {
//   (
//     async () => {
//       map = await initialiseMap()

//       // add ability to drop pin on map
//       // add Marker interaction
//       map.on('click', (e) => {
//         vectorSource.clear()
//         const point = new Point(e.coordinate)
//         const marker = new Feature({
//           type: 'marker',
//           geometry: point
//         })
//         vectorSource.addFeature(marker)
//       })
//     }
//   )()
// }

export { initialiseMap }
