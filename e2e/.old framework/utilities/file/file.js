import fs from 'node:fs'

class TextReplace {
  async textFileRead (filename, encoding) {
    const data = fs.readFileSync(filename, encoding)
    return data
  }
}
export default new TextReplace()
