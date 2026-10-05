const cookieBannerContainer = document.querySelector('.js-cookie-banner-container')
// Hide Banner as not required on cookies page
if (cookieBannerContainer) {
  cookieBannerContainer.parentNode.removeChild(cookieBannerContainer)
}

const cookiePreferencesSet = window.sir.utils.getCookie('cookies_preferences_set')
if (cookiePreferencesSet) {
  // Get tracking preference
  const cookieSettings = window.sir.utils.getCookie('cookies_settings')
  if (cookieSettings) {
    const trackingPreferences = JSON.parse(decodeURIComponent(cookieSettings))
    if (trackingPreferences.analytics === 'on') {
      document.querySelector('#f-cookieConsent').checked = true
    } else {
      document.querySelector('#f-cookieConsent-2').checked = true
    }
  }
}

const saveButton = document.querySelector('#continue-button')
saveButton?.addEventListener('click', (e) => {
  e.preventDefault()
  const analyticsPreference = document.querySelector('input[name="cookieConsent"]:checked')
  window.sir.utils.savePreference(analyticsPreference.value === 'Yes')
  if (analyticsPreference.value === 'Yes') {
    window.sir.utils.setupGoogleTagManager()
  } else {
    window.sir.utils.deleteAnalyticsCookies()
  }
  window.scrollTo(0, 0)
  const successBanner = document.querySelector('#successBanner')
  successBanner.removeAttribute('hidden')
})
