import constants from '../../../utils/constants.js'

describe('mud/description', () => {
  it('Should call createDescriptionRoutes with correct config', () => {
    const createDescriptionRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/description.js', () => ({
        __esModule: true,
        default: createDescriptionRoutes
      }))
      require('../../mud/description.js')
    })
    expect(createDescriptionRoutes).toHaveBeenCalledTimes(1)
    expect(createDescriptionRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_DESCRIPTION
    })
  })
})
