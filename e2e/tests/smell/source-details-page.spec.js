import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Source details tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.sourceDetails.page)
  })

  it('@routing routes yes -> location home', async () => {
    await steps.choose(pages.sourceDetails.yes)
    await steps.type(pages.sourceDetails.siteName, 'Site Name')
    await steps.type(pages.sourceDetails.sourceTown, 'Town')
    await steps.submit()
    await steps.expectOn(pages.locationHome?.page || { title: 'Is the smell affecting you at home?', slug: 'smell/location-home' })
  })
})
