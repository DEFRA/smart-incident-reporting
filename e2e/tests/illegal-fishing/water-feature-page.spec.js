import { pages } from '../../pages/illegal-fishing/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Illegal fishing - Water feature tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.waterFeature.page)
  })

  it('@routing routes river -> activity', async () => {
    await steps.choose(pages.waterFeature.river)
    await steps.type(pages.waterFeature.riverDetails, 'River Don')
    await steps.submit()
    await steps.expectOn(pages.activity.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.waterFeature.requiredError)
  })
})
