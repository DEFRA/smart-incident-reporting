'use strict'

const { Paths, Views, RedisKeys, SirpRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_EQUIPMENT, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    const payload = request.payload
    console.log(JSON.stringify(payload))
    RedisService.set(
      request,
      RedisKeys.FISHING_EQUIPMENT_PAYLOAD,
      JSON.stringify(payload)
    )
    _generateSirpData(request, payload)
    return h.view(Views.FISHING_CAUGHTORKILLED, {
      ...context
    })
  }
}

const _generateSirpData = (request, payload) => {
  const illegalFishingObj = {}
  const equipmentValues = []
  const equipments = payload['fish-equipment']
  if (Array.isArray(equipments)) {
    let i = 0
    while (i < equipments.length) {
      equipmentValues.push(_getFishingEquipmentMappedValue(equipments[i]))
      i++
    }
  } else {
    equipmentValues.push(_getFishingEquipmentMappedValue(equipments))
  }

  illegalFishingObj.sirp_equipmentillegalfishing = equipmentValues
  illegalFishingObj.sirp_equipmentillegalfishingother = ''
  if (equipmentValues.includes(700)) {
    illegalFishingObj.sirp_equipmentillegalfishingother = payload['other-equipment']
  }

  RedisService.set(
    request,
    SirpRedisKeys.SIRP_FISHING_EQUIPMENT_PAYLOAD,
    JSON.stringify(illegalFishingObj)
  )
}

const _getFishingEquipmentMappedValue = (fishingEquipment) => {
  if (fishingEquipment === 'nets') {
    return 100
  } else if (fishingEquipment === 'rod') {
    return 200
  } else if (fishingEquipment === 'explosives') {
    return 300
  } else if (fishingEquipment === 'other') {
    return 700
  } else if (fishingEquipment === 'dunno') {
    return 800
  }
}

const _getContext = () => {
  return {
    pageTitle: 'Report an environmental incident',
    hideBackLink: true
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.FISHING_EQUIPMENT}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_EQUIPMENT_ANSWER}`,
    handler: handlers.post
  }
]
