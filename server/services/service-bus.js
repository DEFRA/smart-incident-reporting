// Note we will use passwordless connectivity to service bus via azure identity
// This means the service principal of the webapp will need contributor/write
// access to the servicebus 
import { ServiceBusClient } from '@azure/service-bus'
import { DefaultAzureCredential } from '@azure/identity'
import config from '../utils/config.js'
const connectionString = config.serviceBusConnectionString
const serviceBusNamespace = 'DEVSIRINFSB1401.servicebus.windows.net'

const credential = new DefaultAzureCredential()

const queueName = 'devsirinfsb1401-sbncomq-general'

const sendMessage = async () => {
  const sbClient = new ServiceBusClient(connectionString)

  const sender = sbClient.createSender(queueName)

  let batch = await sender.createMessageBatch()

  batch.tryAddMessage({ body: {
    foo: 'bar'
  }})
  await sender.sendMessages(batch)
  await sender.close()

}

export {
  sendMessage
}