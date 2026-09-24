import constants from '../../utils/constants.js'
import createDescriptionRoutes from '../rars/description.js'

export default createDescriptionRoutes({
  problem: 'mud',
  route: constants.routes.MUD_DESCRIPTION,
  redirect: {
    recurring: constants.routes.MUD_RECURRING
  }
})
