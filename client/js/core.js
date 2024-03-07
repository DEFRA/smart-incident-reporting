'use strict'
// "sir" represents the global namespace for client side js across the service
window.sir = {
  utils: {
    setupGoogleTagManager: () => {
      const gaid = process.env.GA_ID
      if (gaid) {
        const script = document.createElement('script')
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaid}`
        script.onload = () => {
          window.dataLayer = window.dataLayer || []
          function gtag () { window.dataLayer.push(arguments) }
          gtag('js', new Date())
          gtag('config', gaid, { cookie_domain: window.location.hostname })
        }
        document.body.appendChild(script)
      }
    }
  }
}

// Just initialise GA for all page views atm, cookie banner and opt in is to come
window.sir.utils.setupGoogleTagManager()
