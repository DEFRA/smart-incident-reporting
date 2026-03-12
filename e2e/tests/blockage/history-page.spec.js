import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Blockage - History tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.history.page)
  })

  it('@routing routes yes + details -> extent', async () => {
    await steps.choose(pages.history.yes)
    await steps.type(pages.history.yesDetails, 'Been there for days')
    await steps.submit()
    await steps.expectOn(pages.extent.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.history.requiredError)
  })
})
