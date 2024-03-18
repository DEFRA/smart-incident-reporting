'use strict'
// "sir" represents the global namespace for client side js across the service
window.sir = {
  utils: {
    setupGoogleTagManager: () => {
      const gaId = process.env.GA_ID
      if (gaId) {
        const script = document.createElement('script')
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
        script.onload = () => {
          window.dataLayer = window.dataLayer || []
          function gtag () { window.dataLayer.push(arguments) }
          gtag('js', new Date())
          gtag('config', gaId, { cookie_domain: window.location.hostname })
        }
        document.body.appendChild(script)
      }
    }
  }
}

// Just initialise GA for all page views atm, cookie banner and opt in is to come
window.sir.utils.setupGoogleTagManager()
