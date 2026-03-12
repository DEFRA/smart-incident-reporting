import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Blockage - River name tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.riverName.page)
  })

  it('@routing routes yes + details -> blockage type', async () => {
    await steps.choose(pages.riverName.yes)
    await steps.type(pages.riverName.yesDetails, 'River Test')
    await steps.submit()
    await steps.expectOn(pages.blockageType.page)
  })

  it('@validation shows validation error when yes without name', async () => {
    await steps.choose(pages.riverName.yes)
    await steps.submit()
    await steps.expectErrorText(pages.riverName.requiredError)
  })
})
