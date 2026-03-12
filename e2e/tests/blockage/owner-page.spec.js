import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Blockage - Owner tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.owner.page)
  })

  it('@routing routes any selection -> contact details', async () => {
    await steps.choose(pages.owner.no)
    await steps.submit()
    await steps.expectOn(pages.contactDetails.page)
  })
})
