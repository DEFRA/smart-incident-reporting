import accessibleAutocomplete from 'accessible-autocomplete'
import { panToOSValue, panToPoint, panToBbox } from './map.js'

let autoCompleteValue
const locationSearchButton = document.getElementById('search-location')
const currentLocationErrorId = 'current-location-error'

// Events
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
    hideError()
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

  if (document.getElementById('point-error')) {
    document.getElementById('point-error').remove()
  }
  const formGroup = document.getElementsByClassName('govuk-form-group')[0]
  formGroup.classList.remove('govuk-form-group--error')

  if (errorMessage) {
    errorMessage.innerText = message
    errorMessage.href = '#location'
    if (document.getElementById(currentLocationErrorId)) {
      document.getElementById(currentLocationErrorId).remove()
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

const hideError = () => {
  const errorSummaryElement = document.querySelector('.govuk-error-summary')
  const errorElement = document.getElementById(currentLocationErrorId)
  if (errorSummaryElement && errorElement) {
    errorSummaryElement.remove()
    errorElement.remove()
  }
}

const blurLocationInput = () => {
  const locationinput = document.getElementById('location')
  locationinput.blur()
}

const getLocationName = (value) => {
  let location = ''
  if (value?.GAZETTEER_ENTRY.NAME1) {
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
    placeholder: 'Search for a place in England',
    minLength: 3,
    autoselect: false,
    showNoOptionsFound: true,
    displayMenu: 'overlay',
    templates: {
      suggestion: getLocationName,
      inputValue: (value) => {
        return value?.GAZETTEER_ENTRY.NAME1
      }
    },
    source: async (query, populateResults) => {
      autoCompleteValue = null
      const response = await fetch(`/api/location-suggestions?location=${query}`)
      const data = await response.json()

      const englandmatches = data.filter(item => {
        return (item.GAZETTEER_ENTRY.COUNTRY === 'England' &&
          item.GAZETTEER_ENTRY.NAME1.toLowerCase().replaceAll(' ', '')
            .includes(query.toLowerCase().replaceAll(' ', '')))
      })
      populateResults(englandmatches)
    },
    onConfirm: (value) => {
      if (value) {
        blurLocationInput()
        panToOSValue(value)
      } else {
        autoCompleteValue = value
      }
      hideError()
    }
  })

  setTimeout(() => {
    const wrapper = document.querySelector('.location-input-wrapper')
    const input = document.getElementById('location')
    if (!wrapper || !input) return

    const clearBtn = document.createElement('button')
    clearBtn.type = 'button'
    clearBtn.className = 'clear-input-button'
    clearBtn.setAttribute('aria-label', 'Clear search input')
    clearBtn.innerHTML = `<svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10,8.6L15.6,3L17,4.4L11.4,10L17,15.6L15.6,17L10,11.4L4.4,17L3,15.6L8.6,10L3,4.4L4.4,3L10,8.6Z" style="fill: currentcolor; stroke-width: 0;">
    </path>
    </svg>`

    wrapper.appendChild(clearBtn)

    const toggleClear = () => {
      clearBtn.style.display = input.value ? 'block' : 'none'
    }

    input.addEventListener('input', toggleClear)

    clearBtn.addEventListener('click', () => {
      input.value = ''
      input.dispatchEvent(new Event('input'))
      autoCompleteValue = null
      hideError()
      input.focus()
      toggleClear()
    })

    toggleClear()
  }, 0)

  const locationTextBox = document.getElementById('location')
  locationTextBox.addEventListener('keyup', async (e) => {
    e.preventDefault()
    if (!autoCompleteValue && e.key === 'Enter') {
      await searchLocation()
    }
  })

  locationTextBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      blurLocationInput()
    }
  })
}

export {
  initialiseLocationSearch
}
