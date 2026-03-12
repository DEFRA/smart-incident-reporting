import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Blockage - Location description tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.locationDescription.page)
  })

  it('@routing routes enter text -> when', async () => {
    await steps.type(pages.locationDescription.locationDescription, 'Near the bridge')
    await steps.submit()
    await steps.expectOn(pages.when.page)
  })

  it('@validation shows validation error when empty', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.locationDescription.requiredError)
  })
})
