import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Clothing and hair tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    // Navigate via current -> smell strength -> indoors to reach clothing and hair
    await steps.open(pages.current.page)
    await steps.choose(pages.current.yes)
    await steps.submit()
    await steps.expectOn(pages.smellStrength.page)
    await steps.choose(pages.smellStrength.weak)
    await steps.submit()
    await steps.expectOn(pages.indoors.page)
    await steps.choose(pages.indoors.yes)
    await steps.submit()
    await steps.expectOn(pages.clothingAndHair.page)
  })

  it('@routing routes no -> effect on daily life', async () => {
    await steps.choose(pages.clothingAndHair.no)
    await steps.submit()
    await steps.expectOn(pages.effectOnDailyLife.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.clothingAndHair.requiredError)
  })
})
