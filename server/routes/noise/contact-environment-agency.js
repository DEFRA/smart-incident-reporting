import constants from '../../utils/constants.js'
import createContactEnvironmentAgencyRoutes from '../rars/contact-environment-agency.js'

export default createContactEnvironmentAgencyRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_CONTACT_ENVIRONMENT_AGENCY
})
