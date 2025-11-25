import { initialiseMap, panToPoint, dropPin, transformPoint } from '../map.js'
import { initialiseLocationSearch } from '../location-search.js'

const currentLocationButton = document.getElementById('current-location')

// Initialise the location search feature
initialiseLocationSearch()

// Helper to get coordinates via browser geolocation
const getLocation = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve([position.coords.longitude, position.coords.latitude]),
      (error) => reject(error)
    )
  })
}

// Core function to handle current location logic
const handleCurrentLocation = async () => {
  if (!('geolocation' in navigator)) {
    console.warn('Geolocation not supported by this browser.')
    return
  }

  try {
    const location = await getLocation()
    const transformed = transformPoint(location)
    panToPoint(transformed, 1000)
    dropPin(transformed)
  } catch (error) {
    console.error('Error getting location:', error)
  }
}

// Enable the “Current Location” button functionality
currentLocationButton.addEventListener('click', async (e) => {
  e.preventDefault()
  await handleCurrentLocation()
})


window.addEventListener('DOMContentLoaded', async () => {
  try {
    // safeMapConfig is injected server-side via template
    // e.g. { coordinates: [lng, lat], zoom: 12 }
    const config = window.safeMapConfig

    if (config?.coordinates) {
      // Use cached location if available
      const transformed = transformPoint(config.coordinates)
      panToPoint(transformed, 1000)
      dropPin(transformed)
      console.log('Loaded cached location:', config.coordinates)
    } else {
      // Fallback to current location if no cached data
      await handleCurrentLocation()
    }
  } catch (error) {
    console.error('Error initializing map:', error)
  }
})

export { initialiseMap }
