// Note that we should be using azure/identiy to connect
// to service bus via azure permissions, however we will
// use connectionstrings for time being whilst are environments are sorted
import { ServiceBusClient } from '@azure/service-bus'
import config from '../utils/config.js'
const connectionString = config.serviceBusConnectionString
const queueName = config.serviceBusQueueName

const sendMessage = async message => {
  const sbClient = new ServiceBusClient(connectionString)
  const sender = sbClient.createSender(queueName)
  const batch = await sender.createMessageBatch()
  batch.tryAddMessage({ body: message })
  await sender.sendMessages(batch)
  await sender.close()
}

export {
  sendMessage
}
