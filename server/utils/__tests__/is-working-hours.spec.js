import wreck from '@hapi/wreck'
jest.mock('@hapi/wreck')

describe('Is working hours', () => {
  it('Test some dates in a single IT to avoid all the hapi server wrapper stuff repeating', done => {
    jest.isolateModules(async () => {
      try {
        process.env.SERVICE_AVAILABLE_CRON = '* * 9-16 * * 1-5'
        const isWorkingHours = require('../is-working-hours').default
        wreck.get.mockResolvedValue({
          res: {
            statusCode: 200
          },
          payload: {
            'england-and-wales': {
              events: [{
                date: '2024-08-26'
              }]
            }
          }
        })

        // Happy paths
        // Standard date within working hours
        expect(await isWorkingHours(new Date('2024-08-01T12:00:00.000Z'))).toBeTruthy()
        expect(await isWorkingHours(new Date('2024-08-01T15:30:00.000Z'))).toBeTruthy()

        // BST + GMT 16:30 and 08:30 times
        expect(await isWorkingHours(new Date('2024-08-01T16:30:00.000Z'))).toBeFalsy()
        expect(await isWorkingHours(new Date('2024-08-01T08:30:00.000Z'))).toBeTruthy()
        expect(await isWorkingHours(new Date('2024-03-26T16:30:00.000Z'))).toBeTruthy()
        expect(await isWorkingHours(new Date('2024-03-26T08:30:00.000Z'))).toBeFalsy()

        // Weekend
        expect(await isWorkingHours(new Date('2024-03-30T12:00:00.000Z'))).toBeFalsy()
        expect(await isWorkingHours(new Date('2024-03-31T12:00:00.000Z'))).toBeFalsy()

        // Week but outside hours
        expect(await isWorkingHours(new Date('2024-03-26T17:00:00.000Z'))).toBeFalsy()
        expect(await isWorkingHours(new Date('2024-03-26T08:59:59.999Z'))).toBeFalsy()

        // bank holiday inside hours
        expect(await isWorkingHours(new Date('2024-08-26T12:00:00.000Z'))).toBeFalsy()

        // bank holiday outside hours
        expect(await isWorkingHours(new Date('2024-08-26T18:00:00.000Z'))).toBeFalsy()

        expect(wreck.get).toHaveBeenCalledTimes(12)

        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('Should return true if cron set to * * * * * * and datetime outside working hours', done => {
    jest.isolateModules(async () => {
      try {
        process.env.SERVICE_AVAILABLE_CRON = '* * * * * *'
        const isWorkingHours = require('../is-working-hours').default
        expect(await isWorkingHours(new Date('2024-03-26T00:00:00.000Z'))).toBeTruthy()
        expect(wreck.get).toHaveBeenCalledTimes(0)
        done()
      } catch (e) {
        done(e)
      }
    })
  })
  it('Should return true if cron set to * * * * * * and no datetime provided', done => {
    jest.isolateModules(async () => {
      try {
        process.env.SERVICE_AVAILABLE_CRON = '* * * * * *'
        const isWorkingHours = require('../is-working-hours').default
        expect(await isWorkingHours()).toBeTruthy()
        expect(wreck.get).toHaveBeenCalledTimes(0)
        done()
      } catch (e) {
        done(e)
      }
    })
  })
  it('Should catch error and reject', done => {
    jest.isolateModules(async () => {
      try {
        process.env.SERVICE_AVAILABLE_CRON = '* * 9-16 * * 1-5'
        wreck.get = jest.fn().mockImplementation(() => Promise.reject(new Error('test error')))
        const isWorkingHours = require('../is-working-hours').default
        await expect(isWorkingHours()).rejects.toEqual(new Error('test error'))
        done()
      } catch (e) {
        done(e)
      }
    })
  })
})
