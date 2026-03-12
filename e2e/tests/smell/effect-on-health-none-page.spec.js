import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Effect on health routing (none)', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.effectOnHealth.page)
  })

  it('@routing routes none of these -> contact details', async () => {
    await steps.choose(pages.effectOnHealth.noneOfThese)
    await steps.submit()
    await steps.expectOn(pages.contactDetails.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.effectOnHealth.requiredError)
  })
})
