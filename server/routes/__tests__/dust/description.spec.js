import constants from '../../../utils/constants.js'

describe('dust/description', () => {
  it('Should call createDescriptionRoutes with correct config', () => {
    const createDescriptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/description.js', () => ({
        __esModule: true,
        default: createDescriptionRoutes
      }))
      require('../../dust/description.js')
    })
    expect(createDescriptionRoutes).toHaveBeenCalledTimes(1)
    expect(createDescriptionRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_DESCRIPTION
    })
  })
})
