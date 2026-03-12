import { pages } from '../../pages/illegal-fishing/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Illegal fishing - Contact details tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.contactDetails.page)
  })

  it('@routing routes submit -> images or video', async () => {
    await steps.submit()
    await steps.expectOn(pages.imagesOrVideo.page)
  })
})
