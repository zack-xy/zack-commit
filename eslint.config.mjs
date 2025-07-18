import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  ignores: ['bin/', '**/bin/**/', 'node_modules/', '**/node_modules/**/', 'dist/', '**/dist/**/'],
})
