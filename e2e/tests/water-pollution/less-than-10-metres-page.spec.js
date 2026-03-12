import { pages } from '../../pages/water-pollution/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Water pollution - Less than 10 metres tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    // Establish session: set water feature and source routing before opening length question
    await steps.open(pages.waterFeature.page)
    await steps.choose(pages.waterFeature.river)
    await steps.type(pages.waterFeature.riverDetails, 'River Don')
    await steps.submit()

    await steps.open(pages.source.page)
    await steps.choose(pages.source.no)
    await steps.submit()

    await steps.open(pages.lessThan10Metres.page)
  })

  it('@routing routes less -> effect on wildlife', async () => {
    await steps.choose(pages.lessThan10Metres.lessThan10Metres)
    await steps.submit()
    await steps.expectOn(pages.effectOnWildlife.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.lessThan10Metres.requiredError)
  })
})
