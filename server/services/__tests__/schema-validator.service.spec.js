import fs from 'fs'
import { validateDataAgainstSchema } from '../../../server/services/schema-validator.service.js'

const wqJsonSchema = JSON.parse(fs.readFileSync('./server/services/json-schemas/sirp_json_schema_WQ_v0.3.json'))
const wqSampleResponse = JSON.parse(fs.readFileSync('./server/__mock-data__/sample_water_quality_incident.json'))

describe('SchemaValidatorService', () => {
  describe('validateDataAgainstSchema', () => {
    it('should validate correctly against a valid schema', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' }
        },
        required: ['name', 'age']
      }

      const data = {
        name: 'John',
        age: 30
      }

      const results = validateDataAgainstSchema(data, schema)

      expect(results).toBe(true)
    })

    it('should return false and log errors for invalid data against schema', () => {
      const schema = {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' }
        },
        required: ['email']
      }

      const data = {
        email: 'notAnEmail'
      }

      const results = validateDataAgainstSchema(data, schema)

      expect(results).toBe(false)
    })

    it('should compile and validate sample against a given schema', () => {
      const results = validateDataAgainstSchema(wqSampleResponse, wqJsonSchema)

      expect(results).toBe(true)
    })
  })
})
