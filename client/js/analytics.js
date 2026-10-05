const analytics = () => {
  const cookieBannerContainer = document.querySelector('.js-cookie-banner-container')
  const acceptButton = document.querySelector('.js-cookies-button-accept')
  const rejectButton = document.querySelector('.js-cookies-button-reject')
  const acceptedBanner = document.querySelector('.js-cookies-accepted')
  const rejectedBanner = document.querySelector('.js-cookies-rejected')
  const questionBanner = document.querySelector('.js-question-banner')
  const cookieBanner = document.querySelector('.js-cookies-banner')

  const cookiePreferencesSet = window.sir.utils.getCookie('cookies_preferences_set')
  if (cookiePreferencesSet) {
    // Hide Banner
    cookieBannerContainer.parentNode.removeChild(cookieBannerContainer)

    // Get tracking preference
    const cookieSettings = window.sir.utils.getCookie('cookies_settings')
    if (cookieSettings) {
      const trackingPreferences = JSON.parse(decodeURIComponent(cookieSettings))
      if (trackingPreferences.analytics === 'on') {
        window.sir.utils.setupGoogleTagManager()
      } else {
        window.sir.utils.deleteAnalyticsCookies()
      }
    }
  } else {
    const showBanner = banner => {
      questionBanner.setAttribute('hidden', 'hidden')
      banner.removeAttribute('hidden')
      // Shift focus to the banner
      banner.setAttribute('tabindex', '-1')
      banner.focus()

      banner.addEventListener('blur', function () {
        banner.removeAttribute('tabindex')
      })
    }

    acceptButton?.addEventListener('click', function (event) {
      event.preventDefault()
      window.sir.utils.savePreference(true)
      window.sir.utils.setupGoogleTagManager()
      showBanner(acceptedBanner)
    })

    rejectButton?.addEventListener('click', function (event) {
      event.preventDefault()
      window.sir.utils.savePreference(false)
      window.sir.utils.deleteAnalyticsCookies()
      showBanner(rejectedBanner)
    })

    acceptedBanner?.querySelector('.js-hide').addEventListener('click', function () {
      cookieBanner.setAttribute('hidden', 'hidden')
    })

    rejectedBanner?.querySelector('.js-hide').addEventListener('click', function () {
      cookieBanner.setAttribute('hidden', 'hidden')
    })
  }
}

export default analytics
