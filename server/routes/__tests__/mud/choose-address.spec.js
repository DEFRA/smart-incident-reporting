import constants from '../../../utils/constants.js'

describe('mud/choose-address', () => {
  it('Should call createChooseAddressRoutes with correct config', () => {
    const createChooseAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/choose-address.js', () => ({
        __esModule: true,
        default: createChooseAddressRoutes
      }))
      require('../../mud/choose-address.js')
    })
    expect(createChooseAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createChooseAddressRoutes).toHaveBeenCalledWith({
      problem: 'mud',
      route: constants.routes.MUD_CHOOSE_ADDRESS,
      redirect: {
        confirmAddress: constants.routes.MUD_CONFIRM_ADDRESS,
        findAddress: constants.routes.MUD_FIND_ADDRESS,
        locationAddress: constants.routes.MUD_LOCATION_ADDRESS
      }
    })
  })
})
