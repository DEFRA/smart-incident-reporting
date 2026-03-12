import WaterPollutionBasePage from './water-pollution-base.page.js'

class LessThanTenPage extends WaterPollutionBasePage {}

export default new LessThanTenPage()

// class LessThanTenPage {
//   // LOCATORS
//   get pageHeading() { return $('h1') }
//   get continueBtn() { return $('button') }
//   get textBox() { return $('textarea')}
//   get helpWithEstLink () { return $('div > details > summary > span') }
//   get lengthDDB() { return $('form > div > div > details > div > p:nth-child(3)')}

//   // METHODS AND FUNCTIONS
//   async getHeading() {
//     await (await this.pageHeading).waitForDisplayed({})
//     return (await this.pageHeading).getText()
//   }

//   async clickContinue() {
//     await (await this.continueBtn).waitForDisplayed({})
//     return (await this.continueBtn).click()
//   }

//   async clickHelpWithEstLink() {
//     await (await this.helpWithEstLink).waitForDisplayed({})
//     return (await this.helpWithEstLink).click()
//   }

//   async getLengthDDB() {
//     await (await this.lengthDDB).waitForDisplayed({})
//     return (await this.lengthDDB).getText()
//   }

// }
// module.exports = new LessThanTenPage()
