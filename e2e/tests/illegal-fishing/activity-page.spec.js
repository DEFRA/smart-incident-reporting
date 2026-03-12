import { pages } from '../../pages/illegal-fishing/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Illegal fishing - Activity tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    // Reset session via illegal-fishing entry path
    await steps.open(pages.start.page)
    await steps.choose(pages.waterFeature.river)
    await steps.submit()
    await steps.expectOn(pages.activity.page)
  })

  it('@routing routes without permission only -> contact owner or police', async () => {
    await steps.choose(pages.activity.withoutPermission)
    await steps.submit()
    await steps.expectOn(pages.contactOwnerOrPolice.page)
  })

  it('@routing routes without rod licence -> rod licence', async () => {
    await steps.choose(pages.activity.withoutRodLicence)
    await steps.submit()
    await steps.expectOn(pages.rodLicence.page)
  })

  it('@routing routes out of season -> location option', async () => {
    await steps.choose(pages.activity.outOfSeason)
    await steps.submit()
    await steps.expectOn(pages.locationOption.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    // Already on activity page from beforeEach
    await steps.submit()
    await steps.expectErrorText(pages.activity.requiredError)
  })
})
