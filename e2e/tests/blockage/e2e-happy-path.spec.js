import { pages as blockagePages } from '../../pages/blockage/index.js'
import { pages as allPages } from '../../pages/index.js'
import { Steps } from '../../test-runner-api/steps.js'

/**
 * Full end-to-end happy path for Blockage journey.
 * yes river, provide river name, blockage type rubbish, describe location,
 * when now, history yes with details, extent less than half, water level yes,
 * flood risk no, owner no, blank contact details, no images, optional other info -> Report sent.
 */

describe('Blockage - Full E2E happy path', () => {
  const steps = new Steps()

  it('completes the journey and reaches Report sent', async () => {
    // River
    await steps.open(blockagePages.river.page)
    await steps.chooseAndSubmit(blockagePages.river.yes)

    // River name
    await steps.choose(blockagePages.riverName.yes)
    await steps.type(blockagePages.riverName.yesDetails, 'River Test')
    await steps.submit()

    // Blockage type
    await steps.chooseAndSubmit(blockagePages.blockageType.rubbish)

    // Location option
    await steps.chooseAndSubmit(blockagePages.locationOption.describeLocation)

    // Location description
    await steps.type(blockagePages.locationDescription.locationDescription, 'Near the old bridge')
    await steps.submit()

    // When
    await steps.chooseAndSubmit(blockagePages.when.now)

    // History
    await steps.choose(blockagePages.history.yes)
    await steps.type(blockagePages.history.yesDetails, 'Been there for days')
    await steps.submit()

    // Extent
    await steps.chooseAndSubmit(blockagePages.extent.lessThanHalf)

    // Water level
    await steps.chooseAndSubmit(blockagePages.waterLevel.yes)

    // Flood risk
    await steps.chooseAndSubmit(blockagePages.floodRisk.no)

    // Owner
    await steps.chooseAndSubmit(blockagePages.owner.no)

    // Contact details (optional fields can be blank)
    await steps.submit()

    // Images or video
    await steps.chooseAndSubmit(blockagePages.imagesOrVideo.no)

    // Other information (optional)
    await steps.submit()

    // Final confirmation
    await steps.expectOn(allPages.common.reportSent.page)
  })
})
