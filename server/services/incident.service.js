'use strict'

const { SirpRedisKeys } = require('../utils/constants')
const RedisService = require('./redis.service')
const { v4: uuidv4 } = require('uuid')
const format = require('date-format')

module.exports = class IncidentService {
  static async generateIncidentJson (request) {
    const incidentTypeFishing = 200

    const iJsonObj = {}
    const incidentObj = iJsonObj.sirp_incident = {}
    incidentObj.sirp_incidentid = uuidv4()
    incidentObj.sirp_incidentreporttype = incidentTypeFishing
    incidentObj.sirp_observeddatetime = new Date().toJSON()// format('yyyy-MM-dd hh:mm:ss:SSS', new Date())
    incidentObj.sirp_reporteddatetime = new Date().toJSON()// format('yyyy-MM-dd hh:mm:ss:SSS', new Date())

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

    console.log(JSON.stringify(iJsonObj))
    return iJsonObj
  }
}
