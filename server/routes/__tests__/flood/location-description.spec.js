import routes from '../../flood/location-description.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.FLOOD_LOCATION_DESCRIPTION
const question = questionSets.FLOOD.questions.FLOOD_LOCATION_DESCRIPTION
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.locationDetails.answerId
}
const getRoute = routes.find(route => route.method === 'GET' && route.path === url)
const postRoute = routes.find(route => route.method === 'POST' && route.path === url)

describe(url, () => {
  let request, toolkit

  beforeEach(() => {
    request = {
      payload: {},
      yar: {
        set: jest.fn()
      }
    }
    toolkit = {
      view: jest.fn().mockReturnValue('view response'),
      redirect: jest.fn().mockReturnValue('redirect response')
    }
  })

  describe('GET', () => {
    it(`Should return the correct view for ${url}`, async () => {
      const response = await getRoute.handler(request, toolkit)

      expect(toolkit.view).toHaveBeenCalledWith(constants.views.FLOOD_LOCATION_DESCRIPTION, { question })
      expect(response).toEqual('view response')
      expect(request.yar.set).not.toHaveBeenCalled()
    })
  })

  describe('POST', () => {
    it('Happy: accept and store a location description', async () => {
      const locationDescription = 'The flood is beside the farm entrance'
      request.payload = { locationDescription }

      const response = await postRoute.handler(request, toolkit)

      expect(request.yar.set).toHaveBeenCalledWith(constants.redisKeys.FLOOD_LOCATION_DESCRIPTION, [{
        ...baseAnswer,
        otherDetails: locationDescription
      }])
      expect(toolkit.redirect).toHaveBeenCalledWith('/next-route')
      expect(toolkit.view).not.toHaveBeenCalled()
      expect(response).toEqual('redirect response')
    })

    it.each([undefined, ''])('Sad: errors on missing or empty locationDescription (%s)', async locationDescription => {
      request.payload = locationDescription === undefined ? {} : { locationDescription }

      const response = await postRoute.handler(request, toolkit)

      expect(toolkit.view).toHaveBeenCalledWith(constants.views.FLOOD_LOCATION_DESCRIPTION, {
        question,
        errorSummary: expect.objectContaining({
          errorList: [{
            text: 'Enter a description of where the flood is located',
            href: '#locationDescription'
          }]
        })
      })
      expect(request.yar.set).not.toHaveBeenCalled()
      expect(toolkit.redirect).not.toHaveBeenCalled()
      expect(response).toEqual('view response')
    })

    it('Sad: errors when locationDescription exceeds the character limit', async () => {
      request.payload = {
        locationDescription: 'a'.repeat(constants.locationDescriptionCharacterLimit + 1)
      }

      const response = await postRoute.handler(request, toolkit)

      expect(toolkit.view).toHaveBeenCalledWith(constants.views.FLOOD_LOCATION_DESCRIPTION, {
        question,
        errorSummary: expect.objectContaining({
          errorList: [{
            text: `Description must be ${constants.locationDescriptionCharacterLimit} characters or less`,
            href: '#locationDescription'
          }]
        })
      })
      expect(request.yar.set).not.toHaveBeenCalled()
      expect(toolkit.redirect).not.toHaveBeenCalled()
      expect(response).toEqual('view response')
    })

    it('Happy: accepts a locationDescription at the character limit', async () => {
      const locationDescription = 'a'.repeat(constants.locationDescriptionCharacterLimit)
      request.payload = { locationDescription }

      const response = await postRoute.handler(request, toolkit)

      expect(request.yar.set).toHaveBeenCalledWith(constants.redisKeys.FLOOD_LOCATION_DESCRIPTION, [{
        ...baseAnswer,
        otherDetails: locationDescription
      }])
      expect(toolkit.redirect).toHaveBeenCalledWith('/next-route')
      expect(toolkit.view).not.toHaveBeenCalled()
      expect(response).toEqual('redirect response')
    })
  })
})
