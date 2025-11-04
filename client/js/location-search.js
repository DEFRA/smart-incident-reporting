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
  if (locationString.length === 0) {
    return showError('Enter a search term, for example a nearby town, city or postcode')
  }
  const response = await fetch(`/api/location?location=${locationString}`)
  const data = await response.json()
  if (data?.GAZETTEER_ENTRY) {
    if (data.GAZETTEER_ENTRY.MBR_XMIN) {
      return panToBbox([data.GAZETTEER_ENTRY.MBR_XMIN, data.GAZETTEER_ENTRY.MBR_YMIN, data.GAZETTEER_ENTRY.MBR_XMAX, data.GAZETTEER_ENTRY.MBR_YMAX])
    } else {
      return panToPoint([data.GAZETTEER_ENTRY.GEOMETRY_X, data.GAZETTEER_ENTRY.GEOMETRY_Y])
    }
  } else {
    return showError('Enter a different search term, for example a nearby town, city or postcode')
  }
}

const showError = (message) => {
  const currentLocation = document.getElementById('current-location')
  const errorMessage = document.getElementById('error-message')
  // Clear out point error if present
  if (document.getElementById('point-error')) {
    document.getElementById('point-error').remove()
  }
  const formGroup = document.getElementsByClassName('govuk-form-group')[0]
  formGroup.classList.remove('govuk-form-group--error')

  if (errorMessage) {
    errorMessage.innerText = message
    errorMessage.href = '#location'
    if (document.getElementById('current-location-error')) {
      document.getElementById('current-location-error').remove()
    }
  } else {
    const formElement = document.getElementsByTagName('form')[0]
    formElement.insertAdjacentHTML('beforebegin', `<div class="govuk-error-summary" data-module="govuk-error-summary">
      <div role="alert">
        <h2 class="govuk-error-summary__title">
          There is a problem
        </h2>
        <div class="govuk-error-summary__body">
          <ul class="govuk-list govuk-error-summary__list">
              <li>
                <a href="#location" id="error-message">${message}</a>
              </li>
          </ul>
        </div>
      </div>
    </div>`)
  }
  currentLocation.insertAdjacentHTML('beforebegin', `<p class="govuk-error-message" id="current-location-error">
    <span class="govuk-visually-hidden">Error:</span> ${message}
  </p>`)
  window.scrollTo({ top: 0 })
  document.getElementsByClassName('govuk-error-summary')[0].focus()
}

const getLocationName = (value) => {
  let location = ''
  if (value?.GAZETTEER_ENTRY.NAME1) {
    location = value.GAZETTEER_ENTRY.NAME1
    if (value.GAZETTEER_ENTRY.COUNTY_UNITARY) {
      location += ` | ${value.GAZETTEER_ENTRY.COUNTY_UNITARY}`
    } else if (value.GAZETTEER_ENTRY.REGION) {
      location += ` | ${value.GAZETTEER_ENTRY.REGION}`
    } else {
      // do nothing for sonarcloud
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
      autoCompleteValue = null
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

  const locationTextBox = document.getElementById('location')
  locationTextBox.addEventListener('keyup', async (e) => {
    e.preventDefault()
    if (!autoCompleteValue && e.key === 'Enter') {
      await searchLocation()
    }
  })
}

export {
  initialiseLocationSearch
}
