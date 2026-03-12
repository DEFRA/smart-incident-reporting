import { pages } from '../../pages/illegal-fishing/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Illegal fishing - Rod licence tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.rodLicence.page)
  })

  it('@routing routes details -> location option', async () => {
    await steps.type(pages.rodLicence.noRodLicenceDetails, 'Observed no licence check and admitted no licence')
    await steps.submit()
    await steps.expectOn(pages.locationOption.page)
  })
})
