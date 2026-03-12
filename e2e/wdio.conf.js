import { ReportAggregator } from 'wdio-html-nice-reporter'
import VideoReporter from 'wdio-video-reporter'

const testRunTimestamp = new Date().toISOString().replaceAll(/[:.]/g, '-')
const selectedBrowser = (process.env.BROWSER || 'chrome').toLowerCase()
const LOCAL_MAX_INSTANCES = 5
let reportAggregator

const resolveCapabilities = (browser) => {
  if (browser === 'chrome') {
    return {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--headless=new',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-extensions',
          '--disable-infobars',
          '--disable-notifications'
        ]
      }
    }
  }

  if (browser === 'firefox') {
    return {
      browserName: 'firefox',
      'moz:firefoxOptions': {
        args: ['-headless']
      }
    }
  }

  if (['edge', 'msedge', 'microsoftedge'].includes(browser)) {
    return {
      browserName: 'MicrosoftEdge',
      'ms:edgeOptions': {
        args: ['--headless', '--disable-gpu']
      }
    }
  }

  return {
    browserName: browser
  }
}

export const config = {
  specs: ['./tests/**/*.js'],
  exclude: [],
  maxInstances: process.env.CI ? 2 : LOCAL_MAX_INSTANCES,

  capabilities: [{
    maxInstances: 1,
    ...resolveCapabilities(selectedBrowser)
  }],
  logLevel: 'warn',
  bail: 0,
  baseUrl: process.env.BASE_URL || 'https://sir-tst1.azure.defra.cloud/',

  // Retry failed tests in CI environment
  specFileRetries: process.env.CI ? 2 : 0,
  specFileRetriesDelay: 0,

  // Default timeout for all WebdriverIO waits (waitUntil, waitForExist, waitForDisplayed)
  waitforTimeout: 12000,

  connectionRetryTimeout: 60000,
  connectionRetryCount: 1,

  reporters: ['spec',
    [VideoReporter, {
      saveAllVideos: false,
      videoSlowdownMultiplier: 3,
      videoRenderTimeout: 5,
      outputDir: '_results_/screenshots'
    }],
    ['html-nice', {
      outputDir: './_results_/test-results/',
      filename: `report-${testRunTimestamp}.html`,
      reportTitle: 'SIRP UI Test Report',
      linkScreenshots: true,
      collapseTests: false,
      // Capture screenshots when a takeScreenshot command occurs
      useOnAfterCommandForScreenshot: true,
      // For master aggregation, keep JSON; per-worker HTML is optional
      produceHtml: false,
      produceJson: true
    }],
    ['junit', {
      outputDir: './_results_/junit',
      outputFileFormat: function (options) {
        return `wdio-junit-${options.cid}.xml`
      }
    }],
    ['allure', {
      outputDir: './_results_/allure-raw',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
      addConsoleLogs: true
    }]
  ],
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },
  before: async function () {
    await browser.maximizeWindow()
  },
  onPrepare: function (_config, capabilities) {
    try {
      // Derive a browser label dynamically from capabilities
      const browserLabel = Array.isArray(capabilities)
        ? [...new Set(capabilities.map(c => c.browserName || c.capabilities?.browserName).filter(Boolean))].join(', ')
        : (capabilities?.browserName || capabilities?.capabilities?.browserName)
      reportAggregator = new ReportAggregator({
        outputDir: './_results_/test-results/',
        filename: `master-${testRunTimestamp}.html`,
        reportTitle: 'SIRP UI Master Report',
        collapseTests: false,
        browserName: browserLabel || 'chrome',
        showInBrowser: true
      })
      reportAggregator.clean()
    } catch (err) {
      // If the aggregator can't be initialized, continue without master report
      console.warn('Master report aggregator init failed:', err?.message)
    }
  },
  // Minimal hook to trigger screenshot capture on failure
  afterTest: async function (_test, _context, { passed }) {
    if (!passed) {
      try {
        await browser.takeScreenshot()
      } catch (err) {
        console.warn('Screenshot capture failed:', err?.message)
      }
    }
    await browser.deleteCookies()
  },
  onComplete: async function () {
    if (reportAggregator && typeof reportAggregator.createReport === 'function') {
      try {
        await reportAggregator.createReport()
      } catch (err) {
        console.warn('Master report generation failed:', err?.message)
      }
    }
  }
}
