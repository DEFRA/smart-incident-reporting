import bngToNgr from '../bng-to-ngr.js'

describe('bng-to-ngr', () => {
  it('Should convert BNG to NGR correctly', () => {
    expect(bngToNgr([365739, 343015]).text).toEqual('SJ 65739 43015')
    expect(bngToNgr([531500, 179045]).text).toEqual('TQ 31500 79045')
    expect(bngToNgr([446443, 261680]).text).toEqual('SP 46443 61680')
    expect(bngToNgr([524177, 374763]).text).toEqual('TF 24177 74763')
    expect(bngToNgr([408853, 507595]).text).toEqual('NZ 08853 07595')
  })
})
