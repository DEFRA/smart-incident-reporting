import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Blockage - River tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.river.page)
  })

  it('@routing routes yes -> river name', async () => {
    await steps.choose(pages.river.yes)
    await steps.submit()
    await steps.expectOn(pages.riverName.page)
  })

  it('@routing routes no -> report directly', async () => {
    await steps.choose(pages.river.no)
    await steps.submit()
    await steps.expectOn(pages.reportDirectly.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.river.requiredError)
  })
})
