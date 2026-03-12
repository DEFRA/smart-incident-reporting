import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Start date time tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.startDateTime.page)
  })

  it('@routing routes now -> smell strength', async () => {
    await steps.choose(pages.startDateTime.now)
    await steps.submit()
    await steps.expectOn(pages.smellStrength.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.startDateTime.requiredError)
  })
})
