'use strict'

const {
  SirpRedisKeys,
  RedisKeys,
  WQSirpRedisKeys
} = require('../utils/constants')
const RedisService = require('./redis.service')
const { v4: uuidv4 } = require('uuid')

module.exports = class IncidentService {
  static async generateIncidentJson(request) {
    const incidentTypeFishing = 200

    const iJsonObj = {}
    const incidentObj = (iJsonObj.sirp_incident = {})
    incidentObj.sirp_incidentid = uuidv4()
    incidentObj.sirp_incidentreporttype = incidentTypeFishing
    incidentObj.sirp_observeddatetime = new Date().toJSON()
    incidentObj.sirp_reporteddatetime = new Date().toJSON()

    incidentObj.sirp_illegalfishing = await RedisService.get(
      request,
      SirpRedisKeys.SIRP_FISHING_EQUIPMENT_PAYLOAD
    )

    const numberOfFish = await RedisService.get(
      request,
      SirpRedisKeys.SIRP_FISHING_NUMBEROFFISH_PAYLOAD
    )
    if (numberOfFish !== undefined) {
      incidentObj.sirp_illegalfishing.sirp_howmanyillegalfish =
        Number(numberOfFish)
    }

    const numberOfAnglers = await RedisService.get(
      request,
      SirpRedisKeys.SIRP_FISHING_NUMBEROFANGLERS_PAYLOAD
    )
    if (numberOfAnglers !== undefined) {
      incidentObj.sirp_illegalfishing.sirp_peopleillegalfishing =
        Boolean(numberOfAnglers)
    }

    const isFishTaken = await RedisService.get(
      request,
      SirpRedisKeys.SIRP_FISHING_CAUGHTORKILLED_PAYLOAD
    )
    if (isFishTaken !== undefined) {
      incidentObj.sirp_illegalfishing.sirp_takenillegalfish =
        Boolean(isFishTaken)
    }

    incidentObj.sirp_illegalfishing.sirp_typeillegalfish =
      await RedisService.get(
        request,
        SirpRedisKeys.SIRP_FISHING_TYPEOFFISH_PAYLOAD
      )

    incidentObj.sirp_illegalfishing.sirp_whyillegalfishing =
      await RedisService.get(
        request,
        SirpRedisKeys.SIRP_FISHING_REPORTREASON_PAYLOAD
      )

    const isITStillHappening = await RedisService.get(
      request,
      SirpRedisKeys.SIRP_FISHING_CURRENT_PAYLOAD
    )
    if (isITStillHappening !== undefined) {
      incidentObj.sirp_illegalfishing.sirp_aretherepeoplefishingstillthere =
        Number(isITStillHappening)
    }

    // sirp_typeillegalfishother
    // Latitude and longitude hardcoded for backend display
    const fishingIncidentCoordinates = await RedisService.get(
      request,
      RedisKeys.FISHING_INCIDENT_COORDINATES
    )
    incidentObj.sirp_incidentlocation = {}
    incidentObj.sirp_incidentlocation.sirp_x =
      fishingIncidentCoordinates.X_COORDINATE
    incidentObj.sirp_incidentlocation.sirp_y =
      fishingIncidentCoordinates.Y_COORDINATE

    console.log(JSON.stringify(iJsonObj))
    return iJsonObj
  }

  static async generateWaterIncidentJson(request) {
    const incidentTypeWater = 300

    const iJsonObj = {}
    const incidentObj = (iJsonObj.sirp_incident = {})
    incidentObj.sirp_incidentid = uuidv4()
    incidentObj.sirp_incidentreporttype = incidentTypeWater
    incidentObj.sirp_observeddatetime = new Date().toJSON()
    incidentObj.sirp_reporteddatetime = new Date().toJSON()

    incidentObj.sirp_WaterQuality = {}

    incidentObj.sirp_WaterQuality.sirp_Doyouthinkyouknowwherethepollutioniscomin =
      Boolean(true)

    const whatKindOfPollution = []
    whatKindOfPollution.push(Number(100))
    incidentObj.sirp_WaterQuality.sirp_Inwhatkindofwaterfeaturehaveyouseenpollut =
      whatKindOfPollution

    incidentObj.sirp_WaterQuality.sirp_waterFeatureOther = 'River Dee'

    const whatDoYouThinkIsInWater = []
    whatDoYouThinkIsInWater.push(Number(200))
    incidentObj.sirp_WaterQuality.sirp_Whatdoyouthinkisinthewater =
      whatDoYouThinkIsInWater

    incidentObj.sirp_WaterQuality.sirp_inWaterOther = 'Something in the river'

    const whatCanYouSeeInWater = []
    whatCanYouSeeInWater.push(Number(200))
    incidentObj.sirp_WaterQuality.sirp_Whatcanyouseeinoronthewater =
      whatCanYouSeeInWater

    const howfaracrossthewaterfeaturecanyouseethe = []
    howfaracrossthewaterfeaturecanyouseethe.push(Number(100))
    incidentObj.sirp_WaterQuality.sirp_Howfaracrossthewaterfeaturecanyouseethe =
      howfaracrossthewaterfeaturecanyouseethe
    incidentObj.sirp_WaterQuality.sirp_onWaterOther = 'Something on the water'

    const howfaralongthewaterfeaturedoesthepollutio = []
    howfaralongthewaterfeaturedoesthepollutio.push(
      howfaralongthewaterfeaturedoesthepollutioText
    )
    incidentObj.sirp_WaterQuality.sirp_Howfaralongthewaterfeaturedoesthepollutio =
      howfaralongthewaterfeaturedoesthepollutio

    incidentObj.sirp_WaterQuality.sirp_pollutionSourceother = 'Not sure'

    incidentObj.sirp_WaterQuality.sirp_Haveyouseendeadfishnearby = Boolean(true)

    const howmanydeadfishhaveyouseen = []
    howmanydeadfishhaveyouseen.push(Number(100))
    incidentObj.sirp_WaterQuality.sirp_Howmanydeadfishhaveyouseen =
      howmanydeadfishhaveyouseen

    // sirp_typeillegalfishother
    // Latitude and longitude hardcoded for backend display
    const waterIncidentCoordinates = await RedisService.get(
      request,
      SirpRedisKeys.WATER_INCIDENT_COORDINATES
    )
    incidentObj.sirp_incidentlocation = {}
    incidentObj.sirp_incidentlocation.sirp_x =
      waterIncidentCoordinates.X_COORDINATE
    incidentObj.sirp_incidentlocation.sirp_y =
      waterIncidentCoordinates.Y_COORDINATE

    console.log(JSON.stringify(iJsonObj))
    return iJsonObj
  }

  static async generateWaterIncidentJson2(request) {
    const incidentTypeWater = 300

    const iJsonObj = {}
    const incidentObj = (iJsonObj.sirp_incident = {})
    incidentObj.sirp_incidentid = uuidv4()
    incidentObj.sirp_incidentreporttype = incidentTypeWater
    incidentObj.sirp_observeddatetime = new Date().toJSON()
    incidentObj.sirp_reporteddatetime = new Date().toJSON()

    incidentObj.sirp_WaterQuality = {}

    // Water Type Done
    const whatKindOfWater = []
    const waterType = await RedisService.get(
      request,
      WQSirpRedisKeys.SIRP_WATER_TYPE
    )
    whatKindOfWater.push(Number(waterType))
    incidentObj.sirp_WaterQuality.sirp_Inwhatkindofwaterfeaturehaveyouseenpollut =
      whatKindOfWater

    // Water type other - Done
    const waterTypeOther = await RedisService.get(
      request,
      WQSirpRedisKeys.SIRP_WATER_FEATURE_OTHER
    )
    if (waterTypeOther !== undefined && waterTypeOther != null) {
      incidentObj.sirp_WaterQuality.sirp_waterFeatureOther = waterTypeOther
    }

    // What can you see in or on the water? - Done
    const wqWhatCanYouSee = await RedisService.get(
      request,
      WQSirpRedisKeys.WQ_SIRP_WHAT_CAN_YOU_SEE
    )
    if (wqWhatCanYouSee !== undefined) {
      incidentObj.sirp_WaterQuality.sirp_Whatcanyouseeinoronthewater =
        wqWhatCanYouSee
    }

    // What is in the water done
    const whatIsInTheWaterArray = []
    const whatIsInTheWater = await RedisService.get(
      request,
      WQSirpRedisKeys.WQ_SIRP_WHAT_IS_IN_WATER
    )
    if (whatIsInTheWater !== undefined) {
      whatIsInTheWaterArray.push(Number(whatIsInTheWater))
      incidentObj.sirp_WaterQuality.sirp_Whatdoyouthinkisinthewater =
        whatIsInTheWaterArray
    }
    // What is in the water other done
    const whatIsInTheWaterOther = await RedisService.get(
      request,
      WQSirpRedisKeys.WQ_SIRP_WHAT_IS_IN_WATER_OTHER
    )
    if (whatIsInTheWaterOther !== undefined) {
      incidentObj.sirp_WaterQuality.sirp_inWaterOther = whatIsInTheWaterOther
    }

    //Is there a smell? - Test
    const smell = await RedisService.get(
      request,
      WQSirpRedisKeys.WQ_SIRP_SMELL_SOURCE
    )
    if (smell !== undefined) {
      incidentObj.sirp_WaterQuality.sirp_isthereasmell = Boolean(smell)
    }
    //Is there a smell - other ? - Test
    const smellOther = await RedisService.get(
      request,
      WQSirpRedisKeys.WQ_SIRP_SMELL_SOURCE_OTHER
    )

    if (smellOther !== undefined) {
      incidentObj.sirp_WaterQuality.isthereasmellother = smellOther
    }

    // Do you know where the pollution is coming from? - Done
    const pollutionSource = await RedisService.get(
      request,
      WQSirpRedisKeys.WQ_SIRP_POLLUTION_SOURCE
    )
    if (pollutionSource !== undefined) {
      incidentObj.sirp_WaterQuality.sirp_Doyouthinkyouknowwherethepollutioniscomin =
        Boolean(pollutionSource)
    }
    // Do you know where the pollution is coming from? - other ? Done
    const pollutionSourceOther = await RedisService.get(
      request,
      WQSirpRedisKeys.WQ_SIRP_POLLUTION_SOURCE_OTHER
    )
    if (pollutionSourceOther !== undefined) {
      incidentObj.sirp_WaterQuality.sirp_pollutionSourceOther =
        pollutionSourceOther
    }

    // How far across Done
    const howFarAcrossArray = []
    const howFarAcross = await RedisService.get(
      request,
      WQSirpRedisKeys.WQ_SIRP_HOW_FAR_ACROSS
    )

    if (howFarAcross !== undefined && howFarAcross != null) {
      howFarAcrossArray.push(Number(howFarAcross))
      incidentObj.sirp_WaterQuality.sirp_Howfaracrossthewaterfeaturecanyouseethe =
        howFarAcrossArray
    }

    // howFarAlong - TEST

    const howFarAlong = await RedisService.get(
      request,
      WQSirpRedisKeys.WQ_SIRP_HOW_FAR_ALONG
    )

    if (howFarAlong !== undefined) {
      incidentObj.sirp_WaterQuality.sirp_Howfaralongthewaterfeaturedoesthepollutio =
        howFarAlong
    }

    // Seen dead fish Done
    const seenDeadFish = await RedisService.get(
      request,
      WQSirpRedisKeys.WQ_SIRP_SEEN_DEAD_FISH
    )
    if (seenDeadFish !== undefined) {
      incidentObj.sirp_WaterQuality.sirp_Haveyouseendeadfishnearby =
        Boolean(seenDeadFish)
    }

    // How many dead fish Done
    const howManyDeadFishArray = []
    const howManyDeadFish = await RedisService.get(
      request,
      WQSirpRedisKeys.WQ_SIRP_HOW_MANY_DEAD_FISH
    )
    if (howManyDeadFish !== undefined) {
      howManyDeadFishArray.push(Number(howManyDeadFish))
      incidentObj.sirp_WaterQuality.sirp_Howmanydeadfishhaveyouseen =
        howManyDeadFishArray
    }

    // sirp_typeillegalfishother
    // Latitude and longitude hardcoded for backend display
    const waterIncidentCoordinates = await RedisService.get(
      request,
      SirpRedisKeys.WATER_INCIDENT_COORDINATES
    )
    incidentObj.sirp_incidentlocation = {}
    if (waterIncidentCoordinates) {
      incidentObj.sirp_incidentlocation.sirp_x =
        waterIncidentCoordinates.X_COORDINATE
      incidentObj.sirp_incidentlocation.sirp_y =
        waterIncidentCoordinates.Y_COORDINATE
    } else {
      incidentObj.sirp_incidentlocation.sirp_x = 51.5
      incidentObj.sirp_incidentlocation.sirp_y = 0.0293
    }

    // What's the address? Done
    const wqAddress = await RedisService.get(
      request,
      SirpRedisKeys.WQ_SIRP_ADDRESS
    )
    if (wqAddress !== undefined && wqAddress != null) {
      incidentObj.sirp_incidentlocation.sirp_address = wqAddress.wq_sirp_address
    }

    // Previously Reported Done
    const wqPreviouslyReported = await RedisService.get(
      request,
      WQSirpRedisKeys.WQ_SIRP_PREVIOUSLY_REPORTED
    )
    if (wqPreviouslyReported !== undefined && wqPreviouslyReported != null) {
      incidentObj.sirp_reporterdetails.sirp_previouslyreported =
        wqPreviouslyReported
    }

    console.log(JSON.stringify(iJsonObj))
    return iJsonObj
  }
}
