import proj4 from 'proj4'
import { get as getProjection, fromLonLat } from 'ol/proj'
import { register } from 'ol/proj/proj4'
import VectorSource from 'ol/source/Vector'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import { Icon, Style } from 'ol/style'
import { Map, View } from 'ol'
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS'
import WMTSCapabilities from 'ol/format/WMTSCapabilities'
import { defaults as defaultControls, ScaleLine } from 'ol/control'
import { defaults as defaultInteractions } from 'ol/interaction'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature.js'
import 'ol/ol.css'

let token, map

const OSGB36 = 'EPSG:27700'
const extent = [0, 0, 700000, 1300000]
const center = [360589, 175650]
const zoom = 1
const maxZoom = 13
const pointElement = document.getElementById('point')
const premiumTileMatrix = [10, 11, 12, 13]

// Map drawing interaction
const vectorSource = new VectorSource({ wrapX: false })

const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: new Style({
    image: new Icon({
      anchor: [0.5, 53],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: '/public/images/marker-black.png'
    })
  })
})

const initialise27700Projection = () => {
  proj4.defs(OSGB36, '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
  '+x_0=400000 +y_0=-100000 +ellps=airy ' +
  '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
  '+units=m +no_defs')
  register(proj4)
  getProjection(OSGB36).setExtent(extent)
}

const setToken = async () => {
  const response = await fetch('/api/os-api-token') // eslint-disable-line
  const data = await response.json()
  if (data.access_token) {
    token = data.access_token
    const timeout = (data.expires_in - 30) * 1000
    setTimeout(setToken, timeout)
  } else {
    throw new Error('Unable to retrieve token')
  }
}

const getFetchOptions = () => {
  return {
    headers: { Authorization: `Bearer ${token}` }
  }
}

const getOptionsFromCapabilities = async () => {
  const url = 'https://api.os.uk/maps/raster/v1/wmts?request=GetCapabilities&service=WMTS'
  const parser = new WMTSCapabilities()
  const response = await fetch(url, getFetchOptions())
  const text = await response.text()
  const parsedCapabilities = parser.read(text)
  // Delete premium OS data layers
  premiumTileMatrix.forEach(value => {
    delete parsedCapabilities.Contents.TileMatrixSet[0].TileMatrix[value]
  })
  return optionsFromCapabilities(parsedCapabilities, {
    layer: 'Road_27700'
  })
}

const getBase64TileSource = async blob => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader() //eslint-disable-line
      reader.onloadend = () => {
        resolve(reader.result)
      }
      reader.readAsDataURL(blob)
    } catch (err) {
      reject(new Error(err))
    }
  })
}

const tileLoadAsync = async (tile, src) => {
  const response = await fetch(src, getFetchOptions())
  if (response.ok) {
    const base64TileSource = await getBase64TileSource(await response.blob())
    tile.getImage().src = base64TileSource
  }
}

const tileLoad = (tile, src) => {
  (
    async () => {
      await tileLoadAsync(tile, src)
    }
  )()
}

const dropPin = (coordinate) => {
  console.log(coordinate)
  vectorSource.clear()
  const point = new Point(coordinate)
  const marker = new Feature({
    type: 'marker',
    geometry: point
  })
  vectorSource.addFeature(marker)
  if (pointElement) {
    pointElement.value = JSON.stringify(coordinate)
  }
}

const panToPoint = (point, extentBuffer = 250) => {
  map.getView().fit([point[0] - extentBuffer, point[1] - extentBuffer, point[0] + extentBuffer, point[1] + extentBuffer])
}

const panToBbox = (bbox) => {
  map.getView().fit(bbox)
}

const transformPoint = (point) => {
  return fromLonLat(point, OSGB36)
}

const panToOSValue = (value) => {
  if (value?.GAZETTEER_ENTRY) {
    if (value.GAZETTEER_ENTRY.MBR_XMIN) {
      panToBbox([value.GAZETTEER_ENTRY.MBR_XMIN, value.GAZETTEER_ENTRY.MBR_YMIN, value.GAZETTEER_ENTRY.MBR_XMAX, value.GAZETTEER_ENTRY.MBR_YMAX])
    } else {
      panToPoint([value.GAZETTEER_ENTRY.GEOMETRY_X, value.GAZETTEER_ENTRY.GEOMETRY_Y])
    }
  }
}

const initialiseMap = options => {
  (
    async () => {
      await setToken()
      initialise27700Projection()
      const capabilityOptions = await getOptionsFromCapabilities()
      const osSource = new WMTS({
        attributions: '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>',
        tileLoadFunction: tileLoad,
        ...capabilityOptions
      })
      const oSLayer = new TileLayer({
        source: osSource
      })

      const interactions = options?.disableControls
        ? []
        : defaultInteractions({
          altShiftDragRotate: false,
          pinchRotate: false
        })

      const controls = defaultControls().extend([
        new ScaleLine({
          units: 'metric',
          minWidth: 100
        })
      ])

      const view = new View({
        projection: OSGB36,
        showFullExtent: false,
        extent,
        center: options?.point || center,
        zoom: options?.zoom || zoom,
        maxZoom
      })

      const layers = [
        oSLayer,
        vectorLayer
      ]

      map = new Map({
        target: 'map',
        interactions,
        controls,
        layers,
        view
      })

      if (options?.point) {
        dropPin(options.point)
      }

      if (!options?.disableControls) {
        // add Marker interaction
        map.on('click', (e) => {
          dropPin(e.coordinate)
        })
      }
    }
  )()
}

export {
  initialiseMap,
  panToPoint,
  panToBbox,
  panToOSValue,
  dropPin,
  transformPoint
}
