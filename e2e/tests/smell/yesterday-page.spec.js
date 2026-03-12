import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Yesterday tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.yesterday.page)
  })

  it('@routing routes valid time -> current', async () => {
    await steps.type(pages.yesterday.time, '01:00am')
    await steps.submit()
    await steps.expectOn(pages.current.page)
  })

  it('@validation shows validation error when empty', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.yesterday.requiredError)
  })
})
