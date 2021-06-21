module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Awacs',
      items: [
        'index',
        {
          type: 'category',
          label: 'Concepts',
          collapsed: false,
          items: ['privacy', 'security'],
        },
        {
          type: 'category',
          label: 'Getting Started',
          collapsed: false,
          items: [
            'getting-started/installation',
            'getting-started/configuration',
          ],
        },
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
      ],
    },
  ],
}
