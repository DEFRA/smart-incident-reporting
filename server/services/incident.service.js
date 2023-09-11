'use strict'

const { SirpRedisKeys, RedisKeys } = require('../utils/constants')
const RedisService = require('./redis.service')
const { v4: uuidv4 } = require('uuid')

module.exports = class IncidentService {
  static async generateIncidentJson (request) {
    const incidentTypeFishing = 200

    const iJsonObj = {}
    const incidentObj = iJsonObj.sirp_incident = {}
    incidentObj.sirp_incidentid = uuidv4()
    incidentObj.sirp_incidentreporttype = incidentTypeFishing
    incidentObj.sirp_observeddatetime = new Date().toJSON()
    incidentObj.sirp_reporteddatetime = new Date().toJSON()

    incidentObj.sirp_illegalfishing = await RedisService.get(request, SirpRedisKeys.SIRP_FISHING_EQUIPMENT_PAYLOAD)

    const numberOfFish = await RedisService.get(request, SirpRedisKeys.SIRP_FISHING_NUMBEROFFISH_PAYLOAD)
    if (numberOfFish !== undefined) {
      incidentObj.sirp_illegalfishing.sirp_howmanyillegalfish = Number(numberOfFish)
    }

    const numberOfAnglers = await RedisService.get(request, SirpRedisKeys.SIRP_FISHING_NUMBEROFANGLERS_PAYLOAD)
    if (numberOfAnglers !== undefined) {
      incidentObj.sirp_illegalfishing.sirp_peopleillegalfishing = Boolean(numberOfAnglers)
    }

    const isFishTaken = await RedisService.get(request, SirpRedisKeys.SIRP_FISHING_CAUGHTORKILLED_PAYLOAD)
    if (isFishTaken !== undefined) {
      incidentObj.sirp_illegalfishing.sirp_takenillegalfish = Boolean(isFishTaken)
    }

    incidentObj.sirp_illegalfishing.sirp_typeillegalfish = await RedisService.get(request, SirpRedisKeys.SIRP_FISHING_TYPEOFFISH_PAYLOAD)

    incidentObj.sirp_illegalfishing.sirp_whyillegalfishing = await RedisService.get(request, SirpRedisKeys.SIRP_FISHING_REPORTREASON_PAYLOAD)

    const isITStillHappening = await RedisService.get(request, SirpRedisKeys.SIRP_FISHING_CURRENT_PAYLOAD)
    if (isITStillHappening !== undefined) {
      incidentObj.sirp_illegalfishing.sirp_aretherepeoplefishingstillthere = Number(isITStillHappening)
    }

    // sirp_typeillegalfishother
    // Latitude and longitude hardcoded for backend display
    const fishingIncidentCoordinates = await RedisService.get(request, RedisKeys.FISHING_INCIDENT_COORDINATES)
    incidentObj.sirp_incidentlocation = {}
    incidentObj.sirp_incidentlocation.sirp_x = fishingIncidentCoordinates.X_COORDINATE
    incidentObj.sirp_incidentlocation.sirp_y = fishingIncidentCoordinates.Y_COORDINATE

    console.log(JSON.stringify(iJsonObj))
    return iJsonObj
  }

  static async generateWaterIncidentJson (request) {
    const incidentTypeWater = 300

    const iJsonObj = {}
    const incidentObj = iJsonObj.sirp_incident = {}
    incidentObj.sirp_incidentid = uuidv4()
    incidentObj.sirp_incidentreporttype = incidentTypeWater
    incidentObj.sirp_observeddatetime = new Date().toJSON()
    incidentObj.sirp_reporteddatetime = new Date().toJSON()

    incidentObj.sirp_WaterQuality = { }

    incidentObj.sirp_WaterQuality.sirp_Doyouthinkyouknowwherethepollutioniscomin = Boolean(true)

    const whatKindOfPollution = []
    whatKindOfPollution.push(Number(100))
    incidentObj.sirp_WaterQuality.sirp_Inwhatkindofwaterfeaturehaveyouseenpollut = whatKindOfPollution

    incidentObj.sirp_WaterQuality.sirp_waterFeatureOther = 'River Dee'

    const whatDoYouThinkIsInWater = []
    whatDoYouThinkIsInWater.push(Number(200))
    incidentObj.sirp_WaterQuality.sirp_Whatdoyouthinkisinthewater = whatDoYouThinkIsInWater

    incidentObj.sirp_WaterQuality.sirp_inWaterOther = 'Something in the river'

    const whatCanYouSeeInWater = []
    whatCanYouSeeInWater.push(Number(200))
    incidentObj.sirp_WaterQuality.sirp_Whatcanyouseeinoronthewater = whatCanYouSeeInWater

    const howfaracrossthewaterfeaturecanyouseethe = []
    howfaracrossthewaterfeaturecanyouseethe.push(Number(100))
    incidentObj.sirp_WaterQuality.sirp_Howfaracrossthewaterfeaturecanyouseethe = howfaracrossthewaterfeaturecanyouseethe

    incidentObj.sirp_WaterQuality.sirp_onWaterOther = 'Something on the water'

    const howfaralongthewaterfeaturedoesthepollutio = []
    howfaralongthewaterfeaturedoesthepollutio.push(Number(400))
    incidentObj.sirp_WaterQuality.sirp_Howfaralongthewaterfeaturedoesthepollutio = howfaralongthewaterfeaturedoesthepollutio

    incidentObj.sirp_WaterQuality.sirp_pollutionSourceother = 'Not sure'

    incidentObj.sirp_WaterQuality.sirp_Haveyouseendeadfishnearby = Boolean(true)

    const howmanydeadfishhaveyouseen = []
    howmanydeadfishhaveyouseen.push(Number(100))
    incidentObj.sirp_WaterQuality.sirp_Howmanydeadfishhaveyouseen = howmanydeadfishhaveyouseen

    // sirp_typeillegalfishother
    // Latitude and longitude hardcoded for backend display
    const waterIncidentCoordinates = await RedisService.get(request, SirpRedisKeys.WATER_INCIDENT_COORDINATES)
    incidentObj.sirp_incidentlocation = {}
    incidentObj.sirp_incidentlocation.sirp_x = waterIncidentCoordinates.X_COORDINATE
    incidentObj.sirp_incidentlocation.sirp_y = waterIncidentCoordinates.Y_COORDINATE

    console.log(JSON.stringify(iJsonObj))
    return iJsonObj
  }
}
