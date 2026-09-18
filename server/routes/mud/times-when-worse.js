import createTimesWhenWorseRoutes from '../rars/times-when-worse.js'
import constants from '../../utils/constants.js'

export default createTimesWhenWorseRoutes({
  problem: 'mud',
  route: constants.routes.MUD_TIMES_WHEN_WORSE,
  redirect: {
    effectOnDailyLife: constants.routes.MUD_EFFECT_ON_DAILY_LIFE
  }
})
