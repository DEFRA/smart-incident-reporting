import constants from '../../utils/constants.js'
import createContactLocalCouncilRoutes from '../rars/contact-local-council.js'

export default createContactLocalCouncilRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_CONTACT_LOCAL_COUNCIL
})