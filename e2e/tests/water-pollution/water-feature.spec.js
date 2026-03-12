import { pages } from '../../pages/water-pollution/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Water feature - Location option tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.waterFeature.page)
  })

  it('@routing routes river - location option', async () => {
    await steps.choose(pages.waterFeature.river)
    await steps.type(pages.waterFeature.riverDetails, 'River Don')
    await steps.submit()

    await steps.expectOn(pages.locationOption.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.waterFeature.requiredError)
  })
})
