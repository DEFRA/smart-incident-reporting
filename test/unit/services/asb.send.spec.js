const { ServiceBusClient } = require('@azure/service-bus')
jest.mock('@azure/service-bus')
const ASBService = require('../../../server/services/asb.send.js')

describe('ASBService', () => {
  describe('sendMessageToQueue', () => {
    it('should send a message to the correct queue', async () => {
      // Mock the ServiceBusClient and its methods
      const sendMessagesMock = jest.fn()
      const createSenderMock = jest
        .fn()
        .mockReturnValue({ sendMessages: sendMessagesMock })
      const closeMock = jest.fn()

      ServiceBusClient.mockImplementation(() => {
        return {
          createSender: createSenderMock,
          close: closeMock
        }
      })

      // Mock the incidentToPublish and incidentType
      const incidentToPublish = {
        id: 1,
        description: 'Illegal fishing incident'
      }
      const incidentType = 200

      // Call the function
      await ASBService.sendMessageToQueue(incidentToPublish, incidentType)

      // Assert the createSender method call
      expect(createSenderMock).toHaveBeenCalledTimes(1)
      expect(createSenderMock).toHaveBeenCalledWith(expect.any(String))

      // Assert the sendMessages method call
      expect(sendMessagesMock).toHaveBeenCalledTimes(1)
      expect(sendMessagesMock).toHaveBeenCalledWith({
        body: incidentToPublish,
        label: incidentType,
        userProperties: { myCustomPropertyName: 'Custom property' }
      })

      // Assert the close method call
      expect(closeMock).toHaveBeenCalledTimes(2)
    })
  })
})
