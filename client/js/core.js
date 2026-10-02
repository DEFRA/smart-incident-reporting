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
      const secure = window.location.protocol === 'https:' ? ';secure' : ''
      document.cookie = `${cookieName}=${window.btoa(encodeURIComponent(cookieValue))};${sameSite};${expires};path=/${secure}`
    },
    deleteCookie: (cookieName) => {
      const expires = 'expires=Thu, 01 Jan 1970 00:00:01 GMT'
      const path = 'path=/'
      const hostname = window.location.hostname
      const dotHostname = `.${hostname}`
      const domain = (hostname === 'localhost' || hostname === '127.0.0.1') ? '' : `domain=${dotHostname}`
      const domainAttribute = domain ? `;${domain}` : ''
      document.cookie = `${cookieName}=;${expires};${path}${domainAttribute}`
      if (domain) {
        document.cookie = `${cookieName}=;${expires};${path}`
      }
    },
    deleteAnalyticsCookies: () => {
      const splitCookies = document.cookie.split(';')
      let deletedCookieCount = 0
      splitCookies.forEach((cookie) => {
        const nameAndValue = cookie.trim().split('=')
        if (nameAndValue?.length === 2 && ['_ga', '_gid', '_gat', '_dc_gtm_'].some(prefix => nameAndValue[0].startsWith(prefix))) {
          window.sir.utils.deleteCookie(nameAndValue[0])
          deletedCookieCount++
        }
      })
      console.info(`[cookie-consent] Requested deletion of ${deletedCookieCount} analytics cookie(s)`)
    },
    updateGoogleAnalyticsConsent: accepted => {
      window.dataLayer = window.dataLayer || []
      window.gtag = window.gtag || function (...args) { window.dataLayer.push(args) }
      const consent = accepted ? 'granted' : 'denied'
      window.gtag('consent', 'update', {
        ad_storage: consent,
        ad_personalization: consent,
        ad_user_data: consent,
        analytics_storage: consent
      })
      console.info(`[cookie-consent] Google consent mode updated to ${consent}`)
    },
    setupGoogleTagManager: () => {
      const gaId = document.querySelector('meta[name="analytics-account"]')?.content || process.env.GA_ID
      const gtmAlreadyLoaded = document.querySelector('script[src*="googletagmanager.com/gtm.js"]')
      if (gaId && !gtmAlreadyLoaded) {
        console.info('[cookie-consent] Loading GTM after consent')
        const script = document.createElement('script')
        script.src = `https://www.googletagmanager.com/gtm.js?id=${gaId}`
        script.onload = () => {
          console.info('[cookie-consent] GTM loaded')
          window.dataLayer = window.dataLayer || []
          function gtag (...args) { window.dataLayer.push(args) }
          // setupGoogleTagManager is only called after cookies/tracking has been consented to
          gtag('consent', 'default', {
            ad_storage: 'granted',
            ad_personalization: 'granted',
            ad_user_data: 'granted',
            analytics_storage: 'granted'
          })
          window.dataLayer.push({
            'gtm.start': Date.now(),
            event: 'gtm.js'
          })
        }
        script.onerror = () => console.error('[cookie-consent] GTM failed to load')
        document.body.appendChild(script)
      } else {
        const reason = gtmAlreadyLoaded ? 'already loaded' : 'no GTM ID configured'
        console.info(`[cookie-consent] GTM not loaded: ${reason}`)
      }
    },
    savePreference: accepted => {
      console.info(`[cookie-consent] Analytics cookies ${accepted ? 'accepted' : 'rejected'}`)
      const prefs = {
        analytics: accepted ? 'on' : 'off'
      }
      window.sir.utils.setCookie('cookies_settings', JSON.stringify(prefs))
      window.sir.utils.setCookie('cookies_preferences_set', 'true')
      fetch('/cookies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ analytics: String(accepted) })
      }).then(response => {
        if (!response.ok) {
          console.error(`[cookie-consent] Server did not save ${accepted ? 'accepted' : 'rejected'} preference (${response.status})`)
        }
      }).catch(error => {
        console.error('[cookie-consent] Could not send preference to server', error)
      })
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

document.querySelector('#back-link')?.addEventListener('click', event => {
  event.preventDefault()
  window.history.go(-1)
})

// Initialise analytics tracking and associated cookies
analytics()
