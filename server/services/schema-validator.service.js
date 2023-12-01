const Ajv = require('ajv')
const addFormats = require("ajv-formats")

const validateDataAgainstSchema = (data, schema,meta) => {
  const ajv = new Ajv({ strict: false })
  addFormats(ajv)


  // Compile the schema
  const validate = ajv.compile(schema)

  // Perform validation
  const valid = validate(data)

  if (!valid) {
    // Log validation errors if validation fails
    console.error('Validation errors:', validate.errors)
  }

  return valid

}

module.exports = {
  validateDataAgainstSchema
}
