import OdourBasePage from './odour-base-page.js'

class StartDateTimePage extends OdourBasePage {
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
    return (await this.dateDayBox).setValue(text)
  }

  async enterMonth (text) {
    return (await this.dateMonthBox).setValue(text)
  }

  async enterYear (text) {
    return (await this.dateYearBox).setValue(text)
  }

  async enterHour (text, radioButtonOption) {
    const hourBox = this.dateHourBox(radioButtonOption)
    return hourBox.setValue(text)
  }

  async enterMinute (text, radioButtonOption) {
    const minuteBox = this.dateMinuteBox(radioButtonOption)
    return minuteBox.setValue(text)
  }

  async enterPeriod (value, radioButtonOption) {
    const periodDropdown = this.datePeriodBox(radioButtonOption)
    await periodDropdown.selectByVisibleText(value)
  }

  async getCurrentIDError () {
    return (await this.currentIDError).getText()
  }
}

export default new StartDateTimePage()
