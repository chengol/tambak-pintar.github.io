/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  siteMetadata: {
    title: 'Smart Farming',
    author: 'Jala Tech, Pte. Ltd.'
  },
  plugins: [
    {
      resolve: 'gatsby-source-airtable',
      options: {
        apiKey: 'keym2E3xKv1CV3xJo',
        concurrency: 5,
        tables: [
          {
            baseId: 'appr1brQDGlqRbIOB',
            tableName: 'Jawa_Tengah',
          },
        ]
      }
    },
    'gatsby-plugin-postcss',
    'gatsby-plugin-playground',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'src',
        path: `${__dirname}/src/`
      } 
    },
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-relative-images',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 750,
              linkImageToOriginal: false
            }
          }
        ]
      }
    }
    
  ]
}
