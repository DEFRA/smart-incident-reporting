import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Blockage - Flood risk tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.floodRisk.page)
  })

  it('@routing routes already flooding -> flood risk danger', async () => {
    await steps.choose(pages.floodRisk.alreadyFlooding)
    await steps.submit()
    await steps.expectOn(pages.floodRiskDanger.page)
  })

  it('@routing routes no -> owner', async () => {
    await steps.choose(pages.floodRisk.no)
    await steps.submit()
    await steps.expectOn(pages.owner.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.floodRisk.requiredError)
  })
})
