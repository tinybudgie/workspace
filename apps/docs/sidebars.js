// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  docs: [
    {
      type: 'doc',
      id: 'home', // document ID
      label: 'Home', // sidebar label
    },
    {
      type: 'category',
      label: 'Techniques',
      link: {
        type: 'generated-index',
        description: 'Learn about the most important backend techniques!',
        slug: '/techniques',
        keywords: ['techniques'],
      },
      items: ['techniques/dependency-injection', 'techniques/health-checks'],
    },
    {
      type: 'category',
      label: 'Tutorials',
      link: {
        type: 'generated-index',
        description: 'Real world advices and tutorials',
        slug: '/tutorials',
        keywords: ['tutorials'],
      },
      items: [
        {
          type: 'category',
          label: 'Bitcoin Observer',
          link: {
            type: 'doc',
            id: 'tutorials/bitcoin-observer/introduction',
          },
          items: ['tutorials/bitcoin-observer/observer'],
        },
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Tutorial',
      items: ['hello'],
    },
  ],
   */
};

module.exports = sidebars;
