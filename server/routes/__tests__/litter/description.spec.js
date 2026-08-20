import constants from '../../../utils/constants.js'

describe('litter/description', () => {
  it('Should call createDescriptionRoutes with correct config', () => {
    const createDescriptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/description.js', () => ({
        __esModule: true,
        default: createDescriptionRoutes
      }))
      require('../../litter/description.js')
    })
    expect(createDescriptionRoutes).toHaveBeenCalledTimes(1)
    expect(createDescriptionRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_DESCRIPTION
    })
  })
})
