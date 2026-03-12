import { definePage, radioOption, textInput } from '../utils.js'

export const page = definePage({
  key: 'BlockageOwner',
  slug: 'blockage/owner',
  title: 'Do you know who is responsible for causing the blockage?',
})

export const yes = radioOption('Yes')
export const no = radioOption('No')

export const yesDetails = textInput('Yes details')
