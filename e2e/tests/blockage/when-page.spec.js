import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Blockage - When tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.when.page)
  })

  it('@routing routes now -> history', async () => {
    await steps.choose(pages.when.now)
    await steps.submit()
    await steps.expectOn(pages.history.page)
  })

  it('@routing routes earlier today -> earlier today time', async () => {
    await steps.choose(pages.when.earlierToday)
    await steps.submit()
    await steps.expectOn(pages.earlierToday.page)
  })

  it('@routing routes yesterday -> yesterday time', async () => {
    await steps.choose(pages.when.yesterday)
    await steps.submit()
    await steps.expectOn(pages.yesterday.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.when.requiredError)
  })
})
