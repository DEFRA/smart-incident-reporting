import { pages } from '../../pages/illegal-fishing/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Illegal fishing - Number of people tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.numberOfPeople.page)
  })

  it('@routing routes two -> people description', async () => {
    await steps.choose(pages.numberOfPeople.two)
    await steps.submit()
    await steps.expectOn(pages.peopleDescription.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.numberOfPeople.requiredError)
  })
})
