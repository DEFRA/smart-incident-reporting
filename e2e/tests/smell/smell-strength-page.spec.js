import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Smell strength tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    // Set current context before reaching smell strength
    await steps.open(pages.current.page)
    await steps.choose(pages.current.yes)
    await steps.submit()
    await steps.expectOn(pages.smellStrength.page)
  })

  it('@routing routes weak -> indoors', async () => {
    await steps.choose(pages.smellStrength.weak)
    await steps.submit()
    await steps.expectOn(pages.indoors.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.smellStrength.requiredError)
  })
})
