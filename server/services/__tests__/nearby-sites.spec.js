import { findSitesNearby } from '../nearby-sites.js'
import { getJson } from '../../utils/util.js'

jest.mock('../../utils/util.js', () => ({
  getJson: jest.fn()
}))

describe('findSitesNearby', () => {
  afterEach(() => jest.resetAllMocks())

  it('searches only installations, waste operations and end-of-life vehicles registers within 3km', async () => {
    getJson.mockResolvedValue({ items: [] })
    await findSitesNearby(374999.4, 164393.6)
    const query = 'easting=374999&northing=164394&dist=3&_limit=2000'
    expect(getJson).toHaveBeenCalledTimes(3)
    expect(getJson).toHaveBeenCalledWith(`https://environment.data.gov.uk/public-register/industrial-installations/registration.json?${query}`, true)
    expect(getJson).toHaveBeenCalledWith(`https://environment.data.gov.uk/public-register/waste-operations/registration.json?${query}`, true)
    expect(getJson).toHaveBeenCalledWith(`https://environment.data.gov.uk/public-register/end-of-life-vehicles/registration.json?${query}`, true)
  })

  it('returns unique sites across registers ordered by distance, falling back to holder name', async () => {
    getJson
      .mockResolvedValueOnce({
        items: [
          { '@id': 'u1', distance: 2.5, site: { siteAddress: { organization_name: 'Far Site', address: 'A1' } } },
          { '@id': 'u2', distance: 0.1, site: { siteAddress: { organization_name: 'Near Site', address: 'A2' } } }
        ]
      })
      .mockResolvedValueOnce({
        items: [
          { '@id': 'u3', distance: 1.2, holder: { name: 'Holder Only' } },
          { '@id': 'u4', distance: 1.5, site: { siteAddress: { organization_name: 'Near Site', address: 'A2' } } }
        ]
      })
      .mockResolvedValueOnce({ items: [{ '@id': 'u5', distance: 1.8 }] })
    expect(await findSitesNearby(1, 2)).toEqual([
      { id: 'u2', name: 'Near Site', address: 'A2', distance: 0.1 },
      { id: 'u3', name: 'Holder Only', address: '', distance: 1.2 },
      { id: 'u1', name: 'Far Site', address: 'A1', distance: 2.5 }
    ])
  })

  it('still returns results from other registers when one call fails', async () => {
    getJson
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ items: [{ '@id': 'u1', distance: 1, holder: { name: 'Site' } }] })
      .mockResolvedValueOnce({ items: [] })
    expect(await findSitesNearby(1, 2)).toEqual([{ id: 'u1', name: 'Site', address: '', distance: 1 }])
  })

  it('returns an empty list when all api calls fail', async () => {
    getJson.mockRejectedValue(new Error('boom'))
    expect(await findSitesNearby(1, 2)).toEqual([])
  })
})
