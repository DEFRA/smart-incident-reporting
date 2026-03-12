import { pages as fishingPages } from '../../pages/illegal-fishing/index.js'
import { pages as allPages } from '../../pages/index.js'
import { Steps } from '../../test-runner-api/steps.js'

/**
 * Full end-to-end happy path for Illegal Fishing journey using the Steps/FormDriver framework.
 * start -> river (with details) -> activity out of season -> describe location,
 * location description -> when now -> people fishing yes -> number of people two ->
 * people description yes -> description details text -> illegal equipment unknown ->
 * type of fish freshwater -> fish taken no -> contact details -> images or video no ->
 * other information -> Report sent.
 */

describe('Illegal fishing - Full E2E happy path', () => {
  const steps = new Steps()

  it('completes the journey and reaches Report sent', async () => {
    // Entry via start
    await steps.open(fishingPages.start.page)

    // Water feature
    await steps.choose(fishingPages.waterFeature.river)
    await steps.type(fishingPages.waterFeature.riverDetails, 'River Don')
    await steps.submit()

    // Activity
    await steps.chooseAndSubmit(fishingPages.activity.outOfSeason)

    // Location option
    await steps.chooseAndSubmit(fishingPages.locationOption.describeLocation)

    // Location description
    await steps.type(fishingPages.locationDescription.locationDescription, 'On the west bank by the old jetty')
    await steps.submit()

    // When
    await steps.chooseAndSubmit(fishingPages.when.now)

    // People fishing
    await steps.chooseAndSubmit(fishingPages.peopleFishing.yes)

    // Number of people
    await steps.chooseAndSubmit(fishingPages.numberOfPeople.two)

    // People description
    await steps.chooseAndSubmit(fishingPages.peopleDescription.yes)

    // Description details
    await steps.type(fishingPages.descriptionDetails.descriptionDetails, 'Two adults with fishing tackle near the bank')
    await steps.submit()

    // Fish taken
    await steps.chooseAndSubmit(fishingPages.fishTaken.no)

    // Contact details (optional fields can be blank)
    await steps.submit()

    // Images or video
    await steps.chooseAndSubmit(fishingPages.imagesOrVideo.no)

    // Other information (optional)
    await steps.clickButton(fishingPages.otherInformation.sendReportButton)

    // Final confirmation
    await steps.expectOn(allPages.common.reportSent.page)
  })
})
