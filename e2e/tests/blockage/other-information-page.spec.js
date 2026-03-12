import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Blockage - Other information tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.otherInformation.page)
  })

  it('submits additional info', async () => {
    await steps.type(pages.otherInformation.otherInfo, 'No further details')
    await steps.submit()
    // Ends the flow by sending the report; no next page to assert here
  })
})
