import { pages as waterPollutionPages } from '../../pages/water-pollution/index.js'
import { pages as allPages } from '../../pages/index.js'
import { Steps } from '../../test-runner-api/steps.js'

/**
 * Full end-to-end happy path for Water Pollution journey using the Steps/FormDriver framework.
 * choose river, descrube locaiton, sewage, cloudy water, no smell, source unknown, less than 10m,
 * no wildlife impact, blank contact details, no images, no other info -> CYA -> Report sent.
 */

describe('Water pollution - Full E2E happy path', () => {
  const steps = new Steps()

  it('completes the journey and reaches Report sent', async () => {
    // Water feature
    await steps.open(waterPollutionPages.waterFeature.page)
    await steps.chooseAndSubmit(waterPollutionPages.waterFeature.river)

    // Location option
    await steps.chooseAndSubmit(waterPollutionPages.locationOption.describeLocation)

    // Describe location
    await steps.type(waterPollutionPages.locationDescription.locationDescription, 'Near the old bridge')
    await steps.submit()

    // Time
    await steps.chooseAndSubmit(waterPollutionPages.when.now)

    // Pollution substance
    await steps.chooseAndSubmit(waterPollutionPages.pollutionSubstance.sewage)

    // Pollution appearance
    await steps.chooseAndSubmit(waterPollutionPages.pollutionAppearance.cloudyOrGreyWater)

    // Smell description
    await steps.chooseAndSubmit(waterPollutionPages.smellDescription.no)

    // Source
    await steps.chooseAndSubmit(waterPollutionPages.source.no)

    // Length (less than 10 metres path for rivers)
    await steps.chooseAndSubmit(waterPollutionPages.lessThan10Metres.lessThan10Metres)

    // Effect on wildlife
    await steps.chooseAndSubmit(waterPollutionPages.effectOnWildlife.no)

    // Contact details (optional fields can be blank)
    await steps.submit()

    // Images or video
    await steps.chooseAndSubmit(waterPollutionPages.imagesOrVideo.no)

    // Other information (optional)
    await steps.submit()

    // Check your answers
    await steps.expectOn(waterPollutionPages.checkYourAnswers.page)
    await steps.clickButton(waterPollutionPages.checkYourAnswers.sendReportButton)

    // Final confirmation
    await steps.expectOn(allPages.common.reportSent.page)
  })
})
