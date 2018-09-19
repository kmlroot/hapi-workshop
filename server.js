'use strict'

const hapi = require('hapi')

require('dotenv').config()

async function init () {
  const server = hapi.server({
    port: process.env.HAPI_PORT || 3000,
    host: process.env.HAPI_HOST || 'localhost'
  })

  const helloRoute = {
    method: 'GET',
    path: '/hello/{name}/{type}',
    handler: function (req, h) {
      const { type, name } = req.params

      req.logger.info('Calling hello world endpoint')

      return `hello ${type} ${name}`
    }
  }

  const helloWorldPlugin = {
    name: 'hello world again',
    version: '0.0.1',
    register: function (server, options) {
      server.route(helloRoute)
    }
  }

  await server.register({
    plugin: require('hapi-pino'),
    options: {
      prettyPrint: true,
      logEvents: ['response']
    }
  })

  await server.register(helloWorldPlugin)
  await server.start()

  console.log(`Server running at ${server.info.uri}`)
}

init()
