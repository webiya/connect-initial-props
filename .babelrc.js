const { BABEL_ENV } = process.env
const cjs = BABEL_ENV === 'commonjs'
const loose = true

module.exports = {
  presets: [['@babel/env', { loose, modules: false }]],
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-object-rest-spread', { loose }],
    cjs && ['@babel/transform-modules-commonjs', { loose }],
    [
      '@babel/transform-runtime',
      {
        useESModules: !cjs,
        version: require('./package.json').dependencies[
          '@babel/runtime'
          ].replace(/^[^0-9]*/, '')
      }
    ]
  ].filter(Boolean)
}
