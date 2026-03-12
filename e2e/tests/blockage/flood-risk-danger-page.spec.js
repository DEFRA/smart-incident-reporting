import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Blockage - Flood risk danger tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.floodRiskDanger.page)
  })

  it('@routing routes after selecting an option -> owner', async () => {
    await steps.choose(pages.floodRiskDanger.unknown)
    await steps.submit()
    await steps.expectOn(pages.owner.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.floodRiskDanger.requiredError)
  })
})
