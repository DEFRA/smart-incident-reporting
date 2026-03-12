import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Blockage - Extent tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.extent.page)
  })

  it('@routing routes any selection -> water level', async () => {
    await steps.choose(pages.extent.lessThanHalf)
    await steps.submit()
    await steps.expectOn(pages.waterLevel.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.extent.requiredError)
  })
})
