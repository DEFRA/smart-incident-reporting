// Handle factories for creating page and field descriptors.

export const radioOption = (text) => ({ type: 'radioOption', text })
export const checkboxOption = (text) => ({ type: 'checkboxOption', text })
export const textInput = (text) => ({ type: 'textInput', text })
export const link = (text) => ({ type: 'link', text })
export const errorText = (text) => ({ type: 'errorText', text })
export const button = (text) => ({ type: 'button', text })

export const definePage = ({ key, slug, title }) => {
  if (!key) {
    throw new Error('definePage(): missing key')
  }
  if (!slug) {
    throw new Error(`definePage(${key}): missing slug`)
  }
  if (!title) {
    throw new Error(`definePage(${key}): missing title`)
  }
  return { key, slug, title }
}
