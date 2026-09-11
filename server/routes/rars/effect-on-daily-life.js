import constants from '../../utils/constants.js'

const createEffectOnDailyLifeRoutes = ({ route }) => {
  const handlers = {
    get: async (_request, h) => h.view(constants.views.RARS_EFFECT_ON_DAILY_LIFE)
  }

  return [
    {
      method: 'GET',
      path: route,
      handler: handlers.get
    }
  ]
}

export default createEffectOnDailyLifeRoutes
