const { ServiceBusClient } = require('@azure/service-bus')

// Define connection string and related Service Bus entity names here
const fishingConnectionString = 'Endpoint=sb://devsirinfsb1401.servicebus.windows.net/;SharedAccessKeyName=SIRPIllegalFishingQueue;SharedAccessKey=x6JBLaK5tIlR1koIa54ciJf1/Ankl4G86+ASbH/bJ74=;EntityPath=devsirinfsb1401-sbncomq-illegal-fishing'
const waterConnectionString = 'Endpoint=sb://devsirinfsb1401.servicebus.windows.net/;SharedAccessKeyName=SIRPWaterQualityQueue;SharedAccessKey=Iw0WccbWom7XONpVvd50qNuSByMuIX9se+ASbAPxbBM=;EntityPath=devsirinfsb1401-sbncomq-water-quality'

const fishingQueue = 'devsirinfsb1401-sbncomq-illegal-fishing'
const waterQueue = 'devsirinfsb1401-sbncomq-water-quality'

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
      console.log(`Sending message: ${message.body}`)
      await sender.sendMessages(message)

      await sbClient.close()
    } finally {
      await sbClient.close()
    }
  }
}
