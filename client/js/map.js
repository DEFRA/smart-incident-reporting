// Ordnance Survey map initialisation is inspired by https://github.com/OrdnanceSurvey/OS-Data-Hub-API-Demos/tree/3ec3062d286985f7fc899a20be91649ce5d70e03/Airports/Airports-OAuth
import proj4 from 'proj4'
import { get as getProjection, fromLonLat } from 'ol/proj'
import { register } from 'ol/proj/proj4'
// import GeoJSON from 'ol/format/GeoJSON'
import VectorSource from 'ol/source/Vector'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import { Icon, Style } from 'ol/style'
import { Map as OpenLayersMap, View } from 'ol'
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS'
import WMTSCapabilities from 'ol/format/WMTSCapabilities'
import { defaults as defaultControls } from 'ol/control'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature.js'
import 'ol/ol.css'

let token, map

const pointElement = document.getElementById('point')

const config = {
  epsg: '27700',
  centroid: [360589, 175650],
  extent: [0, 0, 700000, 1300000],
  zoom: 1
}

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
  proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
  '+x_0=400000 +y_0=-100000 +ellps=airy ' +
  '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
  '+units=m +no_defs')
  register(proj4)
  getProjection('EPSG:27700').setExtent([0, 0, 700000, 1300000])
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

const getOptionsFromCapabilities = async config => {
  const url = 'https://api.os.uk/maps/raster/v1/wmts?request=GetCapabilities&service=WMTS'
  const parser = new WMTSCapabilities()
  const response = await fetch(url, getFetchOptions()) // eslint-disable-line
  const text = await response.text()
  const parsedCapabilities = parser.read(text)
  return optionsFromCapabilities(parsedCapabilities, {
    layer: `Outdoor_${config.epsg}` // Road_27700, Outdoor_27700 or Leisure_27700
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
      reject(err)
    }
  })
}

const tileLoadAsync = async (tile, src) => {
  const response = await fetch(src, getFetchOptions()) //eslint-disable-line
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

const getOrdnanceSurveySource = options => {
  return new WMTS({
    attributions: '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>',
    tileLoadFunction: tileLoad,
    ...options
  })
}

const getOrdnanceSurveyLayer = options => {
  return new TileLayer({
    source: getOrdnanceSurveySource(options)
  })
}

const getView = config => {
  return new View({
    projection: `EPSG:${config.epsg}`,
    center: config.centroid,
    extent: config.extent,
    zoom: config.zoom,
    showFullExtent: true
  })
}

const getMapOptions = async config => {
  const capabilityOptions = await getOptionsFromCapabilities(config)
  const ordnanceSurveyLayer = getOrdnanceSurveyLayer(capabilityOptions)
  return {
    layers: [ordnanceSurveyLayer, vectorLayer],
    view: getView(config)
  }
}

const getMap = async config => {
  const options = await getMapOptions(config)
  return new OpenLayersMap({
    controls: defaultControls(),
    target: 'map',
    layers: options.layers,
    view: options.view
  })
}


// External functions
const initialiseMap = () => {
  (
    async () => {
      await setToken()
      initialise27700Projection()
      map = await getMap(config)
      // add Marker interaction
      map.on('click', (e) => {
        vectorSource.clear()
        const point = new Point(e.coordinate)
        const marker = new Feature({
          type: 'marker',
          geometry: point
        })
        vectorSource.addFeature(marker)
        pointElement.value = JSON.stringify(e.coordinate)
      })
    }
  )()
}

const panToPoint = (point, extentBuffer = 250) => {
  map.getView().fit([point[0] - extentBuffer, point[1] - extentBuffer, point[0] + extentBuffer, point[1] + extentBuffer])
}

const transformPoint = (point) => {
  return fromLonLat(point, 'EPSG:27700')
}

export { initialiseMap, panToPoint, transformPoint }