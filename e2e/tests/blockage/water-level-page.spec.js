import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Blockage - Water level tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.waterLevel.page)
  })

  it('@routing routes any selection -> flood risk', async () => {
    await steps.choose(pages.waterLevel.yes)
    await steps.submit()
    await steps.expectOn(pages.floodRisk.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.waterLevel.requiredError)
  })
})
