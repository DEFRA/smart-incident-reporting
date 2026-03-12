import { pages } from '../../pages/water-pollution/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Water pollution - Effect on wildlife tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.effectOnWildlife.page)
  })

  it('@routing routes no -> contact details', async () => {
    await steps.choose(pages.effectOnWildlife.no)
    await steps.submit()
    await steps.expectOn(pages.contactDetails.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.effectOnWildlife.requiredError)
  })
})
