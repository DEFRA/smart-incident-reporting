const config = require('../utils/config')
const { ServiceBusClient } = require('@azure/service-bus')

// Define connection string and related Service Bus entity names here
// Get it from the azure portal
const fishingConnectionString = config.fishingConnectionString
const waterConnectionString = config.waterConnectionString

const fishingQueue = config.fishingQueue
const waterQueue = config.waterQueue

module.exports = class ASBService {
  static async sendMessageToQueue (incidentToPublish, incidentType) {
    let sbClient, sender

    if (incidentType === 300) {
      sbClient = new ServiceBusClient(waterConnectionString)
      sender = sbClient.createSender(waterQueue)
    } else {
      sbClient = new ServiceBusClient(fishingConnectionString)
      sender = sbClient.createSender(fishingQueue)
    }

    try {
      const message = {
        body: incidentToPublish,
        label: incidentType,
        userProperties: {
          myCustomPropertyName: 'Custom property'
        }
      }
      // console.log(`Sending message: ${message.body}`)
      await sender.sendMessages(message)

      await sbClient.close()
    } finally {
      await sbClient.close()
    }
  }
}
