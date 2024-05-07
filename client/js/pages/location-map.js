import { initialiseMap, panToPoint, dropPin, transformPoint } from '../map.js'
import { initialiseLocationSearch } from '../location-search.js'

const currentLocationButton = document.getElementById('current-location')

// events 
currentLocationButton.addEventListener('click', async (e) => {
  e.preventDefault()
  if ('geolocation' in navigator) {
    const location = await getLocation()
    panToPoint(transformPoint(location), 1000)
    dropPin(transformPoint(location))
  } else {
    console.log('Geolocation not found in browser')
  }
})

const getLocation = async () => {
  const location =  await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
  return [
    location.coords.longitude,
    location.coords.latitude
  ]
}

initialiseMap()
initialiseLocationSearch()
