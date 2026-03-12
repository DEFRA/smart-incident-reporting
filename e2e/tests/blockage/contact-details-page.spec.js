import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Blockage - Contact details tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.contactDetails.page)
  })

  it('@routing routes with empty values -> images or video', async () => {
    await steps.submit()
    await steps.expectOn(pages.imagesOrVideo.page)
  })
})
