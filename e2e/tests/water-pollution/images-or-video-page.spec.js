import { pages } from '../../pages/water-pollution/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Water pollution - Images or video tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    // Respect session precondition: images-or-video requires contact details submission
    await steps.open(pages.contactDetails.page)
    await steps.submit()
    await steps.open(pages.imagesOrVideo.page)
  })

  it('@routing routes no -> other information', async () => {
    await steps.choose(pages.imagesOrVideo.no)
    await steps.submit()
    await steps.expectOn(pages.otherInformation.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    // Precondition already established in beforeEach: contact details submitted
    await steps.submit()
    await steps.expectErrorText(pages.imagesOrVideo.requiredError)
  })
})
