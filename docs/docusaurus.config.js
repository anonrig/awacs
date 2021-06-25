const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Socketkit Awacs',
  tagline: 'Next-gen behavior analysis service',
  url: 'https://awacs.socketkit.com',
  baseUrl: '/',
  trailingSlash: false,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'socketkit',
  projectName: 'awacs',
  themeConfig: {
    hideableSidebar: true,
    navbar: {
      hideOnScroll: true,
      logo: {
        alt: 'Socketkit',
        src: 'icon-socketkit.svg',
      },
      items: [
        {
          to: 'https://socketkit.com',
          label: 'Home',
          position: 'left',
        },
        {
          to: 'proto/awacs.proto',
          activeBasePath: 'proto',
          label: 'API Reference',
          position: 'left',
        },
        {
          href: 'https://github.com/socketkit/awacs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Socketkit, Inc.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        blog: false,
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: `https://github.com/socketkit/awacs/edit/main/docs`,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          disableVersioning: false,
        },
      },
    ],
  ],
  plugins: [
    [
      'docusaurus-protobuffet-plugin',
      {
        routeBasePath: '/',
        fileDescriptorsPath: './static/proto_workspace.json',
        protoDocsPath: './docs/proto',
        sidebarPath: './sidebars-protodoc.js',
      },
    ],
  ],
}
