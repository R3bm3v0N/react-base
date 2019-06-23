
import fs from 'fs';
import deepmerge from 'deepmerge';

import dotenv from 'dotenv';

let env = dotenv.parse(fs.readFileSync('.env'));
console.log('Application environment variables:', env)
if (env.REACT_APP_NODE_ENV) {
    let overrideEnv = dotenv.parse(fs.readFileSync(`.env.${env.REACT_APP_NODE_ENV}`))
    env = deepmerge(env, overrideEnv);
}
for (let k in env) {
    process.env[k] = env[k]
}


console.log('Application environment variables:')
Object.keys(process.env).filter(v => v.indexOf('APP_') === 0).map(v => console.log(`${v}=${process.env[v]}`))

require('./src/index');