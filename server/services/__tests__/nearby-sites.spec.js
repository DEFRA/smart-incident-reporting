import { findSitesNearby } from '../nearby-sites.js'
import { getJson } from '../../utils/util.js'

jest.mock('../../utils/util.js', () => ({
  getJson: jest.fn()
}))

describe('findSitesNearby', () => {
  afterEach(() => jest.resetAllMocks())

  it('searches only installations and waste operations registers within 3km', async () => {
    getJson.mockResolvedValue({ items: [] })
    await findSitesNearby(374999.4, 164393.6)
    const query = 'easting=374999&northing=164394&dist=3&_limit=2000'
    expect(getJson).toHaveBeenCalledTimes(2)
    expect(getJson).toHaveBeenCalledWith(`https://environment.data.gov.uk/public-register/industrial-installations/registration.json?${query}`, true)
    expect(getJson).toHaveBeenCalledWith(`https://environment.data.gov.uk/public-register/waste-operations/registration.json?${query}`, true)
  })

  it('returns unique sites across registers ordered by distance with split address details', async () => {
    getJson
      .mockResolvedValueOnce({
        items: [
          {
            '@id': 'u1',
            distance: 2.5,
            holder: { name: 'Far Site' },
            registrationNumber: 'EPR/AB1234CD',
            activity: [
              { comment: 'Other activity', primaryActivityFlag: 0 },
              { comment: 'Primary activity', primaryActivityFlag: 1 }
            ],
            site: { siteAddress: { address: 'Unit 1, High Street, Bath, Avon, BA1 3AT', street_address: 'Unit 1, High Street', postcode: 'BA1 3AT' } }
          },
          { '@id': 'u2', distance: 0.1, holder: { name: 'Near Site' }, site: { siteAddress: { address: '2 Low Road', street_address: '2 Low Road' } } }
        ]
      })
      .mockResolvedValueOnce({
        items: [
          { '@id': 'u3', distance: 1.2, site: { siteAddress: { organization_name: 'Org Only' } } },
          { '@id': 'u4', distance: 1.5, holder: { name: 'Near Site' }, site: { siteAddress: { address: '2 Low Road' } } }
        ]
      })
    expect(await findSitesNearby(1, 2)).toEqual({
      apiDown: false,
      sites: [
        { id: 'u2', name: 'Near Site', address: '2 Low Road', streetAddress: '2 Low Road', town: '', postcode: '', registrationNumber: '', primaryActivity: '', distance: 0.1 },
        { id: 'u3', name: 'Org Only', address: '', streetAddress: '', town: '', postcode: '', registrationNumber: '', primaryActivity: '', distance: 1.2 },
        { id: 'u1', name: 'Far Site', address: 'Unit 1, High Street, Bath, Avon, BA1 3AT', streetAddress: 'Unit 1, High Street', town: 'Bath, Avon', postcode: 'BA1 3AT', registrationNumber: 'EPR/AB1234CD', primaryActivity: 'Primary activity', distance: 2.5 }
      ]
    })
  })

  it('excludes mobile plant sites', async () => {
    getJson
      .mockResolvedValueOnce({
        items: [
          { '@id': 'u1', distance: 0.1, holder: { name: 'Mobile' }, site: { siteAddress: { address: 'Mobile Plant, Mobile Plant', street_address: 'Mobile Plant, Mobile Plant' } } },
          { '@id': 'u2', distance: 0.2, holder: { name: 'Fixed' }, site: { siteAddress: { address: '1 High Street', street_address: '1 High Street' } } }
        ]
      })
      .mockResolvedValueOnce({ items: [] })
    const { sites } = await findSitesNearby(1, 2)
    expect(sites.map(site => site.id)).toEqual(['u2'])
  })

  it('handles a single activity returned as an object rather than an array', async () => {
    getJson
      .mockResolvedValueOnce({
        items: [{ '@id': 'u1', distance: 1, holder: { name: 'Site' }, activity: { comment: 'Only activity', primaryActivityFlag: 1 } }]
      })
      .mockResolvedValueOnce({ items: [] })
    const { sites } = await findSitesNearby(1, 2)
    expect(sites[0].primaryActivity).toBe('Only activity')
  })

  it('flags the api as down but still returns results from other registers when one call fails', async () => {
    getJson
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ items: [{ '@id': 'u1', distance: 1, holder: { name: 'Site' } }] })
    expect(await findSitesNearby(1, 2)).toEqual({
      apiDown: true,
      sites: [{ id: 'u1', name: 'Site', address: '', streetAddress: '', town: '', postcode: '', registrationNumber: '', primaryActivity: '', distance: 1 }]
    })
  })

  it('returns an empty list when all api calls fail', async () => {
    getJson.mockRejectedValue(new Error('boom'))
    expect(await findSitesNearby(1, 2)).toEqual({ sites: [], apiDown: true })
  })
})
