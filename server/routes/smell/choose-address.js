import constants from '../../utils/constants.js'
import createChooseAddressRoutes from '../rars/choose-address.js'

export default createChooseAddressRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_CHOOSE_ADDRESS
})
