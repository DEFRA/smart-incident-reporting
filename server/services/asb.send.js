const { ServiceBusClient } = require('@azure/service-bus')

// Define connection string and related Service Bus entity names here
const connectionString = 'Endpoint=sb://devsirinfsb1401.servicebus.windows.net/;SharedAccessKeyName=SIRPIllegalFishingQueue;SharedAccessKey=x6JBLaK5tIlR1koIa54ciJf1/Ankl4G86+ASbH/bJ74=;EntityPath=devsirinfsb1401-sbncomq-illegal-fishing'
const queueName = 'devsirinfsb1401-sbncomq-illegal-fishing'

module.exports = class ASBService {
  static async sendMessageToQueue (incidentToPublish, incidentType) {
    const sbClient = new ServiceBusClient(connectionString)
    const sender = sbClient.createSender(queueName)

    try {
      // for (let i = 0; i < 10; i++) {
      //   const message = {
      //     body: `Hello world! ${i}`,
      //     label: 'test',
      //     userProperties: {
      //       myCustomPropertyName: `my custom property value ${i}`
      //     }
      //   }
      //   console.log(`Sending message: ${message.body}`)
      //   await sender.sendMessages(message)
      // }

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
    // ASBService.sendMessageToQueue().catch((err) => {
    //   console.log('Error occurred: ', err)
    // })
  }
}
