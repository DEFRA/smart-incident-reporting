import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'
import { pastTimeToday } from '../../test-utils/date.js'

describe('Blockage - Earlier today tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.earlierToday.page)
  })

  it('@routing routes time -> history', async () => {
    await steps.type(pages.earlierToday.time, pastTimeToday(10))
    await steps.submit()
    await steps.expectOn(pages.history.page)
  })

  it('@validation shows validation error when empty', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.earlierToday.requiredError)
  })
})
