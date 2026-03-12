import { pages } from '../../pages/illegal-fishing/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Illegal fishing - Number of fish tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.numberOfFish.page)
  })

  it('@routing routes less than five -> contact details', async () => {
    await steps.choose(pages.numberOfFish.lessThanFive)
    await steps.submit()
    await steps.expectOn(pages.contactDetails.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.numberOfFish.requiredError)
  })
})
