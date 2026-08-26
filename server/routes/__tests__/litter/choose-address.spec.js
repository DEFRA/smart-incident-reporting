import constants from '../../../utils/constants.js'

describe('litter/choose-address', () => {
  it('Should call createChooseAddressRoutes with correct config', () => {
    const createChooseAddressRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/choose-address.js', () => ({
        __esModule: true,
        default: createChooseAddressRoutes
      }))
      require('../../litter/choose-address.js')
    })
    expect(createChooseAddressRoutes).toHaveBeenCalledTimes(1)
    expect(createChooseAddressRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_CHOOSE_ADDRESS
    })
  })
})
