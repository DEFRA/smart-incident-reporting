import constants from '../../../utils/constants.js'

describe('smell/description', () => {
  it('Should call createDescriptionRoutes with correct config', () => {
    const createDescriptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/description.js', () => ({
        __esModule: true,
        default: createDescriptionRoutes
      }))
      require('../../smell/description.js')
    })
    expect(createDescriptionRoutes).toHaveBeenCalledTimes(1)
    expect(createDescriptionRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_DESCRIPTION
    })
  })
})
