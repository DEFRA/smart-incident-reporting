import { pages } from '../../pages/water-pollution/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Water pollution - Smell description tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.smellDescription.page)
  })

  it('@routing routes no -> source', async () => {
    await steps.choose(pages.smellDescription.no)
    await steps.submit()
    await steps.expectOn(pages.source?.page || { title: 'Do you know where the pollution is coming from?', slug: 'water-pollution/source' })
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.smellDescription.requiredError)
  })
})
