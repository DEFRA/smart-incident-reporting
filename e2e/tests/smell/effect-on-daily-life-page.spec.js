import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Effect on daily life tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.effectOnDailyLife.page)
  })

  it('@routing routes none of these -> effect on health', async () => {
    await steps.choose(pages.effectOnDailyLife.noneOfThese)
    await steps.submit()
    await steps.expectOn(pages.effectOnHealth.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.effectOnDailyLife.requiredError)
  })
})
