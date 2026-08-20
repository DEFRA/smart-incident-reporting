import constants from '../../../utils/constants.js'

describe('noise/description', () => {
  it('Should call createDescriptionRoutes with correct config', () => {
    const createDescriptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/description.js', () => ({
        __esModule: true,
        default: createDescriptionRoutes
      }))
      require('../../noise/description.js')
    })
    expect(createDescriptionRoutes).toHaveBeenCalledTimes(1)
    expect(createDescriptionRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_DESCRIPTION
    })
  })
})
