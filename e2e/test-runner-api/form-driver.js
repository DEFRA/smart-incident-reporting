export class FormDriver {
  // ----ACTION METHODS---- //
  async open (slug) {
    await browser.url(slug)
  }

  async clickContinue () {
    const continueButton = await $('aria/Continue')
    await continueButton.waitForClickable({ timeout: 3000 })
    await continueButton.click()
  }

  async clickButton (buttonText) {
    const button = await $(`.govuk-button=${buttonText}`)
    await button.waitForClickable({ timeout: 5000 })
    await button.click()
  }

  async clickLink (linkText) {
    // Prefer anchor tag and link text
    let link = await $(`a=${linkText}`)
    const exists = await link.isExisting()
    if (!exists) {
      // Fallback to accessible name
      link = await $(`aria/${linkText}`)
    }
    await link.waitForClickable({ timeout: 3000 })
    await link.click()
  }

  async selectRadioByLabel (optionText) {
    const radioOption = await $(`.govuk-radios__label=${optionText}`)
    await radioOption.waitForClickable({ timeout: 3000 })
    await radioOption.click()
  }

  async selectCheckboxByLabel (optionText) {
    const checkboxOption = await $(`.govuk-checkboxes__label=${optionText}`)
    await checkboxOption.waitForClickable({ timeout: 3000 })
    await checkboxOption.click()
  }

  async enterTextByLabel (labelText, value) {
    // Resolve the input via its associated label's "for" attribute
    const label = await $(`label=${labelText}`)
    const id = await label.getAttribute('for')

    // If the label doesn't have a "for", try aria as a fallback
    let input
    if (id) {
      input = await $(`#${id}`)
    } else {
      input = await $(`aria/${labelText}`)
    }
    await input.waitForEnabled({ timeout: 3000 })
    await input.setValue(value)
  }

  // ----ASSERTION METHODS---- //
  async assertTitle (expectedTitle) {
    const headerTag = await $('h1')
    await headerTag.waitForExist({ timeout: 3000 })
    await expect(headerTag).toHaveText(expectedTitle)
  }

  async assertErrorSummaryVisible () {
    const summary = await $('.govuk-error-summary')
    await summary.waitForExist({ timeout: 3000 })
    await expect(summary).toBeDisplayed()
  }

  async assertErrorSummaryText (expectedText) {
    await this.assertErrorSummaryVisible()
    const list = await $('.govuk-error-summary__list')
    await list.waitForExist({ timeout: 3000 })
    const actualText = await list.getText()
    expect(actualText).toContain(expectedText)
  }

  async assertMainContainsText (expectedText) {
    const actual = await this.getMainText()
    const actualTrimmed = actual.toString().replaceAll(/\s/g, '')
    const expectedTrimmed = expectedText.toString().replaceAll(/\s/g, '')
    await expect(actualTrimmed).toContain(expectedTrimmed)
  }

  // -----GETTERS----- //
  async getMainText () {
    const main = await $('main')
    await main.waitForExist({ timeout: 3000 })
    return main.getText()
  }
}
