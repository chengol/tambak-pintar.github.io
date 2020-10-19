import React from 'react'

import { graphql } from 'gatsby'

export const query = graphql`
query (
    $slug: String!
  ){
    markdownRemark(
      fields: {
        slug: {
          eq: $slug
        }
      }
    ){
      frontmatter{
        title
        date
      }
      html
    }
  }`

export default function BlogTemplate(props) {
    
    return (
        <div>
            <h1>{props.data.markdownRemark.frontmatter.title}</h1>
            <p>{props.data.markdownRemark.frontmatter.date}</p>
            <div dangerouslySetInnerHTML={{ __html: props.data.markdownRemark.html }}></div>
        </div>
    )
}
