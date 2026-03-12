import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Current tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.current.page)
  })

  it('@routing routes yes -> smell strength', async () => {
    await steps.choose(pages.current.yes)
    await steps.submit()
    await steps.expectOn(pages.smellStrength.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.current.requiredError)
  })
})
