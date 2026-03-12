import { pages } from '../../pages/water-pollution/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Water pollution - Pollution appearance tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.pollutionAppearance.page)
  })

  it('@routing routes cloudy -> smell description', async () => {
    await steps.choose(pages.pollutionAppearance.cloudyOrGreyWater)
    await steps.submit()
    await steps.expectOn(pages.smellDescription.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.pollutionAppearance.requiredError)
  })
})
