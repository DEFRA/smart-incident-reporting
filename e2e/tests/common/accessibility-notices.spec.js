import { pages } from '../../pages/index.js'
import { Steps } from '../../test-runner-api/steps.js'
import file from '../../utilities/file/file.js'

describe('Accessibility and Privacy Notices', () => {
  let steps

  beforeEach(async () => {
    steps = new Steps()
    // Open the water pollution feature page (type selection)
    await steps.open(pages.waterPollution.waterFeature.page)
  })

  it('Should verify accessibility link and statement', async () => {
    await steps.clickLink(pages.footer.accessibilityLink)
    await steps.expectOn(pages.accessibility.page)
    const expected = await file.textFileRead('./data/accessibility-stmnt-data.txt', 'utf8')
    await steps.expectText(expected)
  })

  it('Should verify privacy notice link and statement', async () => {
    await steps.clickLink(pages.footer.privacyNoticeLink)
    await steps.expectOn(pages.privacyNotice.page)
    const expected = await file.textFileRead('./data/privacy-notice-data.txt', 'utf8')
    await steps.expectText(expected)
  })
})
