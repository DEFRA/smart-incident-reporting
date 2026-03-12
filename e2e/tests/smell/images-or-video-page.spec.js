import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Images or video tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    // Navigate via contact details to set session before images-or-video
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
