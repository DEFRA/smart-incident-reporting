import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const journeys = [
  {
    problem: 'noise',
    url: constants.routes.NOISE_EFFECT_ON_DAILY_LIFE
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_EFFECT_ON_DAILY_LIFE
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_EFFECT_ON_DAILY_LIFE
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_EFFECT_ON_DAILY_LIFE
  },
  {
    problem: 'smell',
    url: constants.routes.SMELL_EFFECT_ON_DAILY_LIFE
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE
  }
]

describe('RARS effect-on-daily-life', () => {
  describe.each(journeys)('$problem effect-on-daily-life', ({ problem, url }) => {
    it('Should call createEffectOnDailyLifeRoutes with the correct config', () => {
      const createEffectOnDailyLifeRoutes = jest.fn()
      jest.isolateModules(() => {
        jest.doMock('../../rars/effect-on-daily-life.js', () => ({
          __esModule: true,
          default: createEffectOnDailyLifeRoutes
        }))
        require(`../../${problem}/effect-on-daily-life.js`)
      })

      expect(createEffectOnDailyLifeRoutes).toHaveBeenCalledTimes(1)
      expect(createEffectOnDailyLifeRoutes).toHaveBeenCalledWith({
        problem,
        route: url
      })
    })

    describe('GET', () => {
      it('Should return success response and the dummy page title', async () => {
        const response = await submitGetRequest({ url }, 'EFFECT ON DAILY LIFE')
        expect(response.payload).toContain('EFFECT ON DAILY LIFE')
      })
    })
  })
})
