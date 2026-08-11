import constants from '../../utils/constants.js'
import createContactLocalCouncilRoutes from '../rars/contact-local-council.js'

export default createContactLocalCouncilRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_CONTACT_LOCAL_COUNCIL
})
