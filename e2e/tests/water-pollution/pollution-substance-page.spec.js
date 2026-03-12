import { pages } from '../../pages/water-pollution/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Water pollution - Pollution substance tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.pollutionSubstance.page)
  })

  it('@routing routes sewage -> pollution appearance', async () => {
    await steps.choose(pages.pollutionSubstance.sewage)
    await steps.submit()
    await steps.expectOn(pages.pollutionAppearance.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.pollutionSubstance.requiredError)
  })
})
