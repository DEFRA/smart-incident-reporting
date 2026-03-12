import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Blockage - Yesterday tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.yesterday.page)
  })

  it('@routing routes time -> history', async () => {
    await steps.type(pages.yesterday.time, '9:15pm')
    await steps.submit()
    await steps.expectOn(pages.history.page)
  })

  it('@validation shows validation error when empty', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.yesterday.requiredError)
  })
})
