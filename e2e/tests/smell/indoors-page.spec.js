import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Indoors tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    // Set current context and navigate through smell strength to indoors
    await steps.open(pages.current.page)
    await steps.choose(pages.current.yes)
    await steps.submit()
    await steps.expectOn(pages.smellStrength.page)
    await steps.choose(pages.smellStrength.weak)
    await steps.submit()
    await steps.expectOn(pages.indoors.page)
  })

  it('@routing routes yes -> clothing and hair', async () => {
    await steps.choose(pages.indoors.yes)
    await steps.submit()
    await steps.expectOn(pages.clothingAndHair.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.indoors.requiredError)
  })
})
