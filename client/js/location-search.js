import accessibleAutocomplete from 'accessible-autocomplete'
import { panToOSValue, panToPoint, panToBbox } from './map.js'

let autoCompleteValue
const locationSearchButton = document.getElementById('search-location')

/// // Events
locationSearchButton.addEventListener('click', async (e) => {
  e.preventDefault()
  if (autoCompleteValue) {
    panToOSValue(autoCompleteValue)
  } else {
    await searchLocation()
  }
})

const searchLocation = async () => {
  const locationString = document.getElementById('location').value
  const response = await fetch(`/api/location?location=${locationString}`)
  const data = await response.json()
  if (data?.GAZETTEER_ENTRY) {
    if (data.GAZETTEER_ENTRY.MBR_XMIN) {
      panToBbox([data.GAZETTEER_ENTRY.MBR_XMIN, data.GAZETTEER_ENTRY.MBR_YMIN, data.GAZETTEER_ENTRY.MBR_XMAX, data.GAZETTEER_ENTRY.MBR_YMAX])
    } else {
      panToPoint([data.GAZETTEER_ENTRY.GEOMETRY_X, data.GAZETTEER_ENTRY.GEOMETRY_Y])
    }
  } else {
    console.log('No Location results found')
  }
}

const getLocationName = (value) => {
  let location = ''
  if (value && value.GAZETTEER_ENTRY.NAME1) {
    location = value.GAZETTEER_ENTRY.NAME1
    if (value.GAZETTEER_ENTRY.COUNTY_UNITARY) {
      location += ` | ${value.GAZETTEER_ENTRY.COUNTY_UNITARY}`
    } else if (value.GAZETTEER_ENTRY.REGION) {
      location += ` | ${value.GAZETTEER_ENTRY.REGION}`
    }
  }
  return location
}

const initialiseLocationSearch = () => {
  accessibleAutocomplete({
    element: document.querySelector('#location-container'),
    id: 'location',
    minLength: 3,
    autoselect: false,
    showNoOptionsFound: true,
    templates: {
      suggestion: getLocationName,
      inputValue: (value) => {
        return value?.GAZETTEER_ENTRY.NAME1
      }
    },
    source: async (query, populateResults) => {
      autoCompleteValue = undefined
      const response = await fetch(`/api/location-suggestions?location=${query}`)
      // Filter results to exact string matches
      const data = await response.json()
      if (!data || data.length === 0) {
        console.log('No location results found')
      }

      // Strip out any non England results
      const englandmatches = data.filter(item => {
        return (item.GAZETTEER_ENTRY.COUNTRY === 'England' && item.GAZETTEER_ENTRY.NAME1.toLowerCase().replaceAll(' ', '').includes(query.toLowerCase().replaceAll(' ', '')))
      })
      populateResults(englandmatches)
    },
    onConfirm: (value) => {
      if (!value) {
        panToOSValue(autoCompleteValue)
      } else {
        autoCompleteValue = value
      }
    }
  })
}

export {
  initialiseLocationSearch
}
