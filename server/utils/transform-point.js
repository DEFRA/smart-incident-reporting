import proj4 from 'proj4'
import { readFileSync } from 'fs'

const oSTN15 = readFileSync('./server/utils/OSTN15_NTv2_OSGBtoETRS.gsb').buffer

proj4.nadgrid('OSTN15_NTv2_OSGBtoETRS', oSTN15)
proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs +nadgrids=OSTN15_NTv2_OSGBtoETRS')
// proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs')

const oSGBToWGS84 = point => proj4('EPSG:27700', 'EPSG:4326', point)

export {
  oSGBToWGS84
}
