import WaterPollutionBasePage from './water-pollution-base.page.js'

class StartDateTimePage extends WaterPollutionBasePage {
  // LOCATORS
  get textBox () { return $('textarea') }
  get dateDayBox () { return $('#date-day') }
  get dateMonthBox () { return $('#date-month') }
  get dateYearBox () { return $('#date-year') }
  get currentIDError () { return $('[id="current-error"]') }
  dateHourBox (radioButtonOption) { return $(`#hour-${radioButtonOption}`) }
  dateMinuteBox (radioButtonOption) { return $(`#minute-${radioButtonOption}`) }
  datePeriodBox (radioButtonOption) { return $(`#period-${radioButtonOption}`) }

  async enterDay (text) {
    await (await this.dateDayBox).waitForDisplayed({})
    return (await this.dateDayBox).setValue(text)
  }

  async enterMonth (text) {
    await (await this.dateMonthBox).waitForDisplayed({})
    return (await this.dateMonthBox).setValue(text)
  }

  async enterYear (text) {
    await (await this.dateYearBox).waitForDisplayed({})
    return (await this.dateYearBox).setValue(text)
  }

  async enterHour (text, radioButtonOption) {
    const hourBox = this.dateHourBox(radioButtonOption)
    await hourBox.waitForDisplayed({})
    return hourBox.setValue(text)
  }

  async enterMinute (text, radioButtonOption) {
    const minuteBox = this.dateMinuteBox(radioButtonOption)
    await minuteBox.waitForDisplayed({})
    return minuteBox.setValue(text)
  }

  async enterPeriod (value, radioButtonOption) {
    const periodDropdown = this.datePeriodBox(radioButtonOption)
    await periodDropdown.waitForDisplayed({})
    await periodDropdown.selectByVisibleText(value)
  }

  async getCurrentIDError () {
    await (await this.currentIDError).waitForDisplayed({})
    return (await this.currentIDError).getText()
  }
}

export default new StartDateTimePage()
