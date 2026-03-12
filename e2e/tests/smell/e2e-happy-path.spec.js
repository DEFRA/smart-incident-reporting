import { pages as smellPages } from '../../pages/smell/index.js'
import { pages as allPages } from '../../pages/index.js'
import { Steps } from '../../test-runner-api/steps.js'

/**
 * Full end-to-end happy path for Smell journey using the Steps/FormDriver framework.
 * source waste site -> source details yes (with minimal details) -> location home no ->
 * describe location -> location description -> smell description sewage ->
 * previous often -> start date time now -> smell strength weak -> indoors yes ->
 * clothing and hair no -> effect on daily life none of these -> effect on health none of these ->
 * medical help no -> contact details -> images or video no -> other information -> Report sent.
 */

describe('Smell - Full E2E happy path', () => {
  const steps = new Steps()

  it('completes the journey and reaches Report sent', async () => {
    // Source
    await steps.open(smellPages.source.page)
    await steps.chooseAndSubmit(smellPages.source.wasteSite)

    // Source details
    await steps.choose(smellPages.sourceDetails.yes)
    await steps.type(smellPages.sourceDetails.siteName, 'Site Name')
    await steps.type(smellPages.sourceDetails.sourceTown, 'Town')
    await steps.submit()

    // Location home
    await steps.chooseAndSubmit(smellPages.locationHome.noSomewhereElse)

    // Location option
    await steps.chooseAndSubmit(smellPages.locationOption.describeLocation)

    // Location description
    await steps.type(smellPages.locationDescription.locationDescription, 'Near the river by the bridge')
    await steps.submit()

    // Smell description
    await steps.chooseAndSubmit(smellPages.description.sewage)

    // Previous occurrences
    await steps.chooseAndSubmit(smellPages.previous.often)

    // Start date and time
    await steps.chooseAndSubmit(smellPages.startDateTime.now)

    // Smell strength
    await steps.chooseAndSubmit(smellPages.smellStrength.weak)

    // Indoors
    await steps.chooseAndSubmit(smellPages.indoors.yes)

    // Clothing and hair
    await steps.chooseAndSubmit(smellPages.clothingAndHair.no)

    // Effect on daily life
    await steps.chooseAndSubmit(smellPages.effectOnDailyLife.noneOfThese)

    // Effect on health
    await steps.chooseAndSubmit(smellPages.effectOnHealth.noneOfThese)

    // Contact details (optional fields can be blank)
    await steps.submit()

    // Images or video
    await steps.chooseAndSubmit(smellPages.imagesOrVideo.no)

    // Other information (optional)
    await steps.clickButton(smellPages.otherInformation.sendReportButton)

    // Final confirmation
    await steps.expectOn(allPages.common.reportSent.page)
  })
})
