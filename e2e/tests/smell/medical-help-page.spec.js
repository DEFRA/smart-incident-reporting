import { pages } from '../../pages/smell/index.js'
import { Steps } from '../../test-runner-api/steps.js'

describe('Smell - Medical help tests', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    await steps.open(pages.medicalHelp.page)
  })

  it('@routing routes no -> contact details', async () => {
    await steps.choose(pages.medicalHelp.no)
    await steps.submit()
    await steps.expectOn(pages.contactDetails.page)
  })

  it('@validation shows validation error when nothing selected', async () => {
    await steps.submit()
    await steps.expectErrorText(pages.medicalHelp.requiredError)
  })
})
