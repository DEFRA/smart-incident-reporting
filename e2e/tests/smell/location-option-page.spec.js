import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Location option tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.locationOption.page)
  })

  it('@routing routes describe location -> location description', async () => {
    await steps.choose(pages.locationOption.describeLocation)
    await steps.submit()
    await steps.expectOn(pages.locationDescription.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.locationOption.requiredError)
  })
})
