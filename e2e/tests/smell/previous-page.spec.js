import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Previous tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.previous.page)
  })

  it('@routing routes yes -> start date time', async () => {
    await steps.choose(pages.previous.often)
    await steps.submit()
    await steps.expectOn(pages.startDateTime.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.previous.requiredError)
  })
})
