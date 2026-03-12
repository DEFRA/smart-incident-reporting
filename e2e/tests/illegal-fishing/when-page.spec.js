import { pages } from '../../pages/illegal-fishing/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Illegal fishing - When tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.when.page)
  })

  it('@routing routes now -> people fishing', async () => {
    await steps.choose(pages.when.now)
    await steps.submit()
    await steps.expectOn(pages.peopleFishing.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.when.requiredError)
  })
})
