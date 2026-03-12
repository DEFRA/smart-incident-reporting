import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Location home tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.locationHome.page)
  })

  it('@routing routes no -> location option', async () => {
    await steps.choose(pages.locationHome.noSomewhereElse)
    await steps.submit()
    await steps.expectOn(pages.locationOption.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.locationHome.requiredError)
  })
})
