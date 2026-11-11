import InteractiveMap from '@defra/interactive-map'
import maplibreProvider from '@defra/interactive-map/providers/maplibre'
import createInteractPlugin from '@defra/interactive-map/plugins/interact'
import '@defra/interactive-map/css'

// The OS Road layer
const OS_STYLE_URL = `${window.location.origin}/public/os-road-style.json`
let token

const setToken = async () => {
  const response = await fetch('/api/os-api-token') // eslint-disable-line
  const data = await response.json()
  if (!data.access_token) {
    throw new Error('Unable to retrieve token')
  }
  token = data.access_token
  setTimeout(setToken, (data.expires_in - 30) * 1000)
}

// Only OS requests get the bearer token
const transformRequest = url => {
  if (url.startsWith('https://api.os.uk/')) {
    return { url, headers: { Authorization: `Bearer ${token}` } }
  }
  return { url }
}

const initialiseMap = async ({ center, sites }) => {
  await setToken()

  const interactPlugin = createInteractPlugin({
    interactionModes: ['selectMarker'],
    deselectOnClickOutside: true
  })

  const map = new InteractiveMap('map', {
    behaviour: 'inline',
    mapProvider: maplibreProvider(),
    mapLabel: 'Map of nearby regulated sites',
    mapStyle: {
      url: OS_STYLE_URL,
      attribution: '© Crown copyright and database rights 2026 OS AC0000807064',
      backgroundColor: '#f5f5f0'
    },
    transformRequest,
    enableMapControls: false,
    enableZoomControls: true,
    center,
    zoom: 14,
    containerHeight: '600px',
    plugins: [interactPlugin]
  })

  map.on('map:ready', () => {
    sites.forEach(({ id, name, coords }) => {
      map.addMarker(id, coords, { label: name, showLabel: false })
    })
    interactPlugin.enable()
    if (sites.length > 1) {
      const lngs = sites.map(site => site.coords[0])
      const lats = sites.map(site => site.coords[1])
      map.fitToBounds([Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)])
    }
  })

  map.on('interact:selectionchange', ({ selectedMarkers }) => {
    sites.forEach(({ id }) => {
      map.updateMarker(id, { showLabel: selectedMarkers.includes(id) })
    })
    const selectedId = selectedMarkers.find(id => sites.some(site => site.id === id))
    document.getElementById('answerId').value = selectedId || ''
    document.getElementById('continue').classList.toggle('govuk-!-display-none', !selectedId)
  })
}

export { initialiseMap }
