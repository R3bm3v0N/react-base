const merge = require('deepmerge'); // https://github.com/webpack/webpack/issues/6584

export type Config = {
  debug?: boolean,
  apiBaseURL?: string
}

const defaultConfigs : Config = {

}
console.log('process.env',process.env)
export default merge(defaultConfigs, require(`./${process.env.REACT_APP_NODE_ENV}`).default) as Config;

