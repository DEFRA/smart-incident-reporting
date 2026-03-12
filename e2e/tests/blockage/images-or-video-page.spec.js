import { pages } from '../../pages/blockage/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Blockage - Images or video tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    // Navigate via contact-details to ensure session prerequisites
    await steps.open(pages.contactDetails.page)
    await steps.submit()
    await steps.expectOn(pages.imagesOrVideo.page)
  })

  it('@routing routes no -> other information', async () => {
    await steps.choose(pages.imagesOrVideo.no)
    await steps.submit()
    await steps.expectOn(pages.otherInformation.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.imagesOrVideo.requiredError)
  })
})
