import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Source tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.source.page)
  })

  it('@routing routes waste site -> source details', async () => {
    await steps.choose(pages.source.wasteSite)
    await steps.submit()
    await steps.expectOn(pages.sourceDetails.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.source.requiredError)
  })
})
