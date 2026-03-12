import { pages } from '../../pages/illegal-fishing/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Illegal fishing - People fishing tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.peopleFishing.page)
  })

  it('@routing routes yes -> number of people', async () => {
    await steps.choose(pages.peopleFishing.yes)
    await steps.submit()
    await steps.expectOn(pages.numberOfPeople.page)
  })

  it('@routing routes no -> people description', async () => {
    await steps.choose(pages.peopleFishing.no)
    await steps.submit()
    await steps.expectOn(pages.peopleDescription.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.peopleFishing.requiredError)
  })
})
