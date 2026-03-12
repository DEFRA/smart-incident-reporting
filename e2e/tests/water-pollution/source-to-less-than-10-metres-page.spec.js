import { pages } from '../../pages/water-pollution/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Water pollution - Source routing to length question', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    // Set water feature to river so source redirects to less-than-10-metres
    await steps.open(pages.waterFeature.page)
    await steps.choose(pages.waterFeature.river)
    await steps.submit()
  })

  it('@routing routes source no -> less-than-10-metres', async () => {
    await steps.open(pages.source.page)
    await steps.choose(pages.source.no)
    await steps.submit()
    await steps.expectOn(pages.lessThan10Metres.page)
  })

  it('@validation shows validation error on source when nothing selected', async () => {
    await steps.open(pages.source.page)
    await steps.submit()
    await steps.expectErrorText(pages.source.requiredError)
  })
})
