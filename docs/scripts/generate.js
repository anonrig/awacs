process.env.CI = true

const fs = require('fs')
const path = require('path')

function copyHelm() {
  const input = path.join(__dirname, '../k8s/helm/README.md')
  const output = path.join(__dirname, '../docs/docs/deployment/helm.md')
  fs.copyFileSync(input, output)
}

async function getOpenAPI() {
  const output = path.join(__dirname, '../docs/static/openapi.json')
  const { build } = await import('../../src/server.js')
  const server = await build()
  const response = await server.inject({
    method: 'GET',
    url: '/docs/json',
  })

  fs.writeFileSync(output, JSON.stringify(await response.json(), null, 2))
}

copyHelm()
getOpenAPI()
