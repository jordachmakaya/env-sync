export default {
  title: 'env-sync',
  description: 'Sync .env files to GitHub and GitLab CI/CD secrets for simple projects and monorepos.',
  base: '/env-sync/',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/quick-start' },
      { text: 'CLI', link: '/reference/cli' },
      { text: 'Security', link: '/guide/security' },
      { text: 'Release', link: '/release/npm-release' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Quick Start', link: '/guide/quick-start' },
          {
            text: 'Project Shapes',
            items: [
              { text: 'Single Project', link: '/guide/single-project' },
              { text: 'Monorepo', link: '/guide/monorepo' },
            ],
          },
          {
            text: 'Providers',
            items: [
              {
                text: 'GitHub',
                items: [
                  { text: 'Overview', link: '/guide/github' },
                  { text: 'Setup', link: '/guide/github-setup' },
                ],
              },
              {
                text: 'GitLab',
                items: [
                  { text: 'Overview', link: '/guide/gitlab' },
                  { text: 'Setup', link: '/guide/gitlab-setup' },
                ],
              },
            ],
          },
          {
            text: 'Concepts',
            items: [
              { text: 'Dry Run', link: '/guide/dry-run' },
              { text: 'Naming', link: '/guide/naming' },
              { text: 'Security', link: '/guide/security' },
              { text: 'Troubleshooting', link: '/guide/troubleshooting' },
            ],
          },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'CLI', link: '/reference/cli' },
          { text: 'API', link: '/reference/api' },
        ],
      },
      {
        text: 'Release',
        items: [
          { text: 'npm Release', link: '/release/npm-release' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jordachmakaya/env-sync' },
    ],
    search: {
      provider: 'local',
    },
  },
};
