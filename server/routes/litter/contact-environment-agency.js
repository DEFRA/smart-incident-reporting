import constants from '../../utils/constants.js'
import createContactEnvironmentAgencyRoutes from '../rars/contact-environment-agency.js'

export default createContactEnvironmentAgencyRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_CONTACT_ENVIRONMENT_AGENCY
})
