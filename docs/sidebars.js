const protodoc = require('./sidebars-protodoc.js')

module.exports = {
  proto: [
    {
      type: 'category',
      label: 'Definitions',
      collapsed: false,
      items: [
        { type: 'doc', id: 'proto/awacs.proto' },
        { type: 'doc', id: 'proto/health.proto' },
      ],
    },
    {
      type: 'category',
      label: 'Services',
      collapsed: false,
      items: [
        { type: 'doc', id: 'proto/awacs/applications.proto' },
        { type: 'doc', id: 'proto/awacs/clients.proto' },
        { type: 'doc', id: 'proto/awacs/events.proto' },
        { type: 'doc', id: 'proto/awacs/sessions.proto' },
      ],
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
