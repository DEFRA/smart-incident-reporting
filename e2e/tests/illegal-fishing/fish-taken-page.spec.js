import { pages } from '../../pages/illegal-fishing/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Illegal fishing - Fish taken tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.fishTaken.page)
  })

  it('@routing routes yes -> number of fish', async () => {
    await steps.choose(pages.fishTaken.yes)
    await steps.submit()
    await steps.expectOn(pages.numberOfFish.page)
  })

  it('@routing routes no -> contact details', async () => {
    await steps.choose(pages.fishTaken.no)
    await steps.submit()
    await steps.expectOn(pages.contactDetails.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.fishTaken.requiredError)
  })
})
