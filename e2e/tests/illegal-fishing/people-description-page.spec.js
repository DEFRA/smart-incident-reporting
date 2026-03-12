import { pages } from '../../pages/illegal-fishing/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Illegal fishing - People description tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    // Ensure session has activity set, then navigate into people description via number of people
    await steps.open(pages.start.page)
    await steps.choose(pages.waterFeature.river)
    await steps.submit()
    await steps.expectOn(pages.activity.page)
    await steps.choose(pages.activity.outOfSeason)
    await steps.submit()

    await steps.open(pages.numberOfPeople.page)
    await steps.choose(pages.numberOfPeople.two)
    await steps.submit()
    await steps.expectOn(pages.peopleDescription.page)
  })

  it('@routing routes yes -> description details', async () => {
    await steps.choose(pages.peopleDescription.yes)
    await steps.submit()
    await steps.expectOn(pages.descriptionDetails.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.peopleDescription.requiredError)
  })
})
