const protodoc = require('./sidebars-protodoc.js')

module.exports = {
  proto: [
    {
      type: 'category',
      label: 'Definitions',
      items: [{ type: 'doc', id: 'proto/awacs.proto' }],
    },
  ],
  docs: [
    {
      type: 'category',
      label: 'Awacs',
      items: [
        'index',
        {
          type: 'category',
          label: 'Getting Started',
          collapsed: false,
          items: [
            'getting-started/installation',
            'getting-started/configuration',
          ],
        },
        'security',
        {
          type: 'category',
          label: 'Guides',
          collapsed: false,
          items: [
            {
              type: 'category',
              label: 'Deployment',
              collapsed: false,
              items: [
                'guides/deployment/docker',
                'guides/deployment/kubernetes',
                'guides/deployment/helm',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Performance',
          collapsed: false,
          items: [
          {
              type: 'doc',
              id: 'performance/high-availability',
            },
            {
              type: 'doc',
              id: 'performance/metrics',
            },
          ],
        },
      ],
    },
  ],
}
