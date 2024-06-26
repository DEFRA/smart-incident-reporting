'use strict'
import analytics from './analytics.js'
// "sir" represents the global namespace for client side js across the service
window.sir = {
  utils: {
    getCookie: (name) => {
      const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
      return v ? decodeURIComponent(window.atob(v[2])) : null
    },
    setCookie: (cookieName, cookieValue, cookieExpiryDays = 365) => {
      const date = new Date()
      date.setTime(date.getTime() + (cookieExpiryDays * 24 * 60 * 60 * 1000))
      const expires = 'expires=' + date.toUTCString()
      const sameSite = 'SameSite=Strict'
      document.cookie = `${cookieName}=${window.btoa(encodeURIComponent(cookieValue))};${sameSite};${expires};path=/;secure`
    },
    deleteCookie: (cookieName) => {
      const expires = 'expires=Thu, 01 Jan 1970 00:00:01 GMT'
      const path = 'path=/'
      const hostname = window.location.hostname
      const dotHostname = `.${hostname}`
      const domain = `domain=${(hostname === 'localhost') ? 'localhost' : dotHostname}`
      document.cookie = `${cookieName}=;${expires};${domain};${path}`
    },
    deleteAnalyticsCookies: () => {
      const splitCookies = document.cookie.split(';')
      splitCookies.forEach((cookie) => {
        const nameAndValue = cookie.trim().split('=')
        if (nameAndValue && nameAndValue.length === 2 && nameAndValue[0].startsWith('_ga')) {
          window.sir.utils.deleteCookie(nameAndValue[0])
        }
      })
    },
    setupGoogleTagManager: () => {
      const gaId = process.env.GA_ID
      if (gaId) {
        const script = document.createElement('script')
        script.src = `https://www.googletagmanager.com/gtm.js?id=${gaId}`
        script.onload = () => {
          window.dataLayer = window.dataLayer || []
          function gtag () { window.dataLayer.push(arguments) }
          gtag('consent', 'default', {
            ad_storage: 'granted',
            ad_personalization: 'granted',
            ad_user_data: 'granted',
            analytics_storage: 'granted'
          })
          window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
          })          
        }
        document.body.appendChild(script)
      }
    },
    savePreference: accepted => {
      const prefs = {
        analytics: accepted ? 'on' : 'off'
      }
      window.sir.utils.setCookie('cookies_settings', JSON.stringify(prefs))
      window.sir.utils.setCookie('cookies_preferences_set', 'true')
    }
  }
}

// Hide defra-js-hide elements on page load
const nonJsElements = document.getElementsByClassName('defra-js-hide')
Array.prototype.forEach.call(nonJsElements, function (element) {
  element.style.display = 'none'
})

// Show defra-js-show elements on page load
// To use this set class to defra-js-show and give hidden attribute or hidden class to hide by default
const jsElements = document.getElementsByClassName('defra-js-show')
Array.prototype.forEach.call(jsElements, function (element) {
  element.removeAttribute('hidden')
  // where an attribute is not possible (gds summaryList row) remove 1 hidden class
  // Note if 2 hidden classes are set then it will remain hidden
  element.className = element.className.replace('hidden', '')
})

// Initialise analytics tracking and associated cookies
analytics()
