import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Location description tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.locationDescription.page)
  })

  it('@routing routes description -> smell description', async () => {
    await steps.type(pages.locationDescription.locationDescription, 'Near the river by the bridge')
    await steps.submit()
    await steps.expectOn(pages.description.page)
  })

  it('@validation shows validation error when empty', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.locationDescription.requiredError)
  })
})
