import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import createReportLocalCouncilRoutes from '../../rars/report-local-council.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_REPORT_LOCAL_COUNCIL,
    header: 'Report the smell to your local council'
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_REPORT_LOCAL_COUNCIL,
    header: 'Report the noise to your local council'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_REPORT_LOCAL_COUNCIL,
    header: 'Report the dust to your local council'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_REPORT_LOCAL_COUNCIL,
    header: 'Report the litter to your local council'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_REPORT_LOCAL_COUNCIL,
    header: 'Report the mud to your local council'
  },
  {
    problem: 'vermin/pests',
    url: constants.routes.PESTS_REPORT_LOCAL_COUNCIL,
    header: 'Report the vermin/pests to your local council'
  }
]

describe('RARS Report Local Council Routes', () => {
  describe.each(problems)('$problem report local council', ({ problem, url, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        const sessionData = problem === 'vermin/pests'
          ? { [constants.redisKeys.PESTS_TYPE_SELECTED]: 'vermin/pests' }
          : {}

        await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      })
    })
  })

  const createRequest = selectedVerminOrPests => ({
    yar: {
      get: jest.fn(key => (key === constants.redisKeys.PESTS_TYPE_SELECTED ? selectedVerminOrPests : undefined))
    }
  })

  it.each([
    { problem: 'smell', route: constants.routes.SMELL_REPORT_LOCAL_COUNCIL },
    { problem: 'noise', route: constants.routes.NOISE_REPORT_LOCAL_COUNCIL },
    { problem: 'dust', route: constants.routes.DUST_REPORT_LOCAL_COUNCIL },
    { problem: 'litter', route: constants.routes.LITTER_REPORT_LOCAL_COUNCIL },
    { problem: 'mud', route: constants.routes.MUD_REPORT_LOCAL_COUNCIL }
  ])('passes title, pageTitle and issue for $problem', async ({ problem, route }) => {
    const [localCouncilRoute] = createReportLocalCouncilRoutes({ problem, route })
    const view = jest.fn()

    await localCouncilRoute.handler(createRequest(), { view })

    expect(view).toHaveBeenCalledWith(constants.views.RARS_REPORT_LOCAL_COUNCIL, expect.objectContaining({
      title: `Report the ${problem} to your local council`,
      pageTitle: `Report the ${problem} to your local council`,
      issue: problem
    }))
  })

  it('passes title, pageTitle and issue for vermin/pests from session', async () => {
    const selectedVerminOrPests = 'rats'
    const [localCouncilRoute] = createReportLocalCouncilRoutes({
      problem: 'vermin/pests',
      route: constants.routes.PESTS_REPORT_LOCAL_COUNCIL
    })
    const view = jest.fn()

    await localCouncilRoute.handler(createRequest(selectedVerminOrPests), { view })

    expect(view).toHaveBeenCalledWith(constants.views.RARS_REPORT_LOCAL_COUNCIL, expect.objectContaining({
      title: `Report the ${selectedVerminOrPests} to your local council`,
      pageTitle: `Report the ${selectedVerminOrPests} to your local council`,
      issue: selectedVerminOrPests
    }))
  })
})
