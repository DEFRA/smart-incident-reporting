import { pages } from '../../pages/illegal-fishing/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Illegal fishing - Location description tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.locationDescription.page)
  })

  it('@routing routes text -> when', async () => {
    await steps.type(pages.locationDescription.locationDescription, 'On the west bank by the old jetty')
    await steps.submit()
    await steps.expectOn(pages.when.page)
  })

  it('@validation shows validation error when empty', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.locationDescription.requiredError)
  })
})
