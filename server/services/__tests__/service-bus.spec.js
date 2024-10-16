import { sendMessage } from '../service-bus.js'
import { ServiceBusClient } from '@azure/service-bus'
jest.mock('@azure/service-bus')

const payload = {
  foo: 'bar'
}

// Welcome to mock inception
const mockSendMessages = jest.fn()
const mockClose = jest.fn()
const mockTryAddMessage = jest.fn()
const senderMock = {
  createMessageBatch: () => {
    return {
      tryAddMessage: mockTryAddMessage
    }
  },
  sendMessages: mockSendMessages,
  close: mockClose
}
const loggerMock = {
  info: jest.fn()
}

describe('service-bus', () => {
  it('Send a message to the service bus', async () => {
    jest.spyOn(ServiceBusClient.prototype, 'createSender').mockImplementation(() => {
      return senderMock
    })
    await sendMessage(loggerMock, payload)
    expect(mockSendMessages).toHaveBeenCalledTimes(1)
    expect(mockClose).toHaveBeenCalledTimes(1)
    expect(mockTryAddMessage).toHaveBeenCalledTimes(1)
    expect(mockTryAddMessage).toHaveBeenCalledWith({ body: payload })
    expect(loggerMock.info).toHaveBeenCalledTimes(1)
  })
})
