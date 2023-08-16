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
    const fishingIncodentCoordinates = await RedisService.get(request, RedisKeys.FISHING_INCIDENT_COORDINATES)
    incidentObj.sirp_incidentlocation = {}
    incidentObj.sirp_incidentlocation.sirp_x = fishingIncodentCoordinates.X_COORDINATE
    incidentObj.sirp_incidentlocation.sirp_y = fishingIncodentCoordinates.Y_COORDINATE

    console.log(JSON.stringify(iJsonObj))
    return iJsonObj
  }
}
