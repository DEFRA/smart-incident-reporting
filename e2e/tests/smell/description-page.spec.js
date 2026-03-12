import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Description tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.description.page)
  })

  it('@routing routes selection -> previous', async () => {
    await steps.choose(pages.description.sewage)
    await steps.submit()
    await steps.expectOn(pages.previous.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.description.requiredError)
  })
})
