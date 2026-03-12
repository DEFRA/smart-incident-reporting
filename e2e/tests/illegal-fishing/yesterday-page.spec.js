import { pages } from '../../pages/illegal-fishing/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Illegal fishing - Yesterday tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.yesterday.page)
  })

  it('@routing routes valid time -> people fishing', async () => {
    await steps.type(pages.yesterday.time, '9:15pm')
    await steps.submit()
    await steps.expectOn(pages.peopleDescription.page)
  })

  it('@validation shows validation error when empty', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.yesterday.requiredError)
  })
})
