import { pages } from '../../pages/illegal-fishing/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Illegal fishing - Earlier today tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.earlierToday.page)
  })

  it('@routing routes valid time -> people fishing', async () => {
    await steps.type(pages.earlierToday.time, '01:00am')
    await steps.submit()
    await steps.expectOn(pages.peopleDescription.page)
  })

  it('@validation shows validation error when empty', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.earlierToday.requiredError)
  })
})
