import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Effect on health routing (medical)', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.effectOnHealth.page)
  })

  it('@routing routes headache -> medical help', async () => {
    await steps.choose(pages.effectOnHealth.headache)
    await steps.submit()
    await steps.expectOn(pages.medicalHelp.page)
  })
})
