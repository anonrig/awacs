process.env.CI = true

const fs = require('fs')
const path = require('path')

function copyHelm() {
  const input = path.join(__dirname, '../../charts/awacs/README.md')
  const output = path.join(__dirname, '../docs/guides/deployment/helm.md')
  const data = fs.readFileSync(input, 'utf8')
  // Produce the existing output where helm and sidebar_position is appended to the output
  fs.writeFileSync(output, data.replace('# awacs', '# Helm'))
}

async function getOpenAPI() {
  try {
    const output = path.join(__dirname, '../static/openapi.json')
    const { build } = await import('../../src/server.js')
    const server = await build()
    const response = await server.inject({
      method: 'GET',
      url: '/docs/json',
    })

    fs.writeFileSync(output, JSON.stringify(await response.json(), null, 2))
  } catch (error) {
    console.warn(`Failed to geneate OpenAPI`, error)
  }
}

copyHelm()
getOpenAPI()
