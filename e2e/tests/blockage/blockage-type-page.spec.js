import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Blockage - Blockage type tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.blockageType.page)
  })

  it('@routing routes any selection -> location option', async () => {
    await steps.choose(pages.blockageType.rubbish)
    await steps.submit()
    await steps.expectOn(pages.locationOption.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.blockageType.requiredError)
  })
})
