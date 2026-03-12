import { pages } from '../../pages/water-pollution/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Water pollution - Contact details tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.contactDetails.page)
  })

  it('@routing routes (optional inputs blank) -> images or video', async () => {
    await steps.submit()
    await steps.expectOn(pages.imagesOrVideo.page)
  })
})
