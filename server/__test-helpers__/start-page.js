import { parse } from 'node-html-parser'

const SCOTLAND_HREF = 'https://www.mygov.scot/report-environmental-incident'
const WALES_HREF = 'https://naturalresources.wales/about-us/contact-us/report-an-incident/?lang=en'
const CALL_CHARGES_HREF = 'https://www.gov.uk/call-charges'

// Asserts the content common to every journey start page.
// - startHref: the journey route the "Start now" button must point to
// - sectionIds: the h2 ids expected on the page
// - links: the journey specific hrefs expected on the page (e.g. Northern Ireland)
const expectStartPageContent = (payload, { startHref, sectionIds, links = [] }) => {
  const content = parse(payload).querySelector('main')
  const hrefs = content.querySelectorAll('a').map(a => a.getAttribute('href'))

  const startButton = content.querySelector('a.govuk-button--start')
  expect(startButton).not.toBeNull()
  expect(startButton.getAttribute('href')).toBe(startHref)

  const headingIds = content.querySelectorAll('h2').map(h2 => h2.getAttribute('id'))
  expect(headingIds).toEqual(expect.arrayContaining(sectionIds))

  expect(hrefs).toEqual(expect.arrayContaining([SCOTLAND_HREF, WALES_HREF, CALL_CHARGES_HREF, ...links]))

  // The content links must be absolute as the pages are only reached from gov.uk
  expect(hrefs.filter(href => href.startsWith('/') && href !== startHref)).toEqual([])

  expect(content.textContent).toContain('0800 80 70 60')
  expect(content.textContent).not.toContain('\u00a0')
}

export {
  expectStartPageContent
}
