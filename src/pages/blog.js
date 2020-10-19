import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'

export default function BlogPage() {
    
    const data = useStaticQuery(graphql`
        query{
            allMarkdownRemark{
                edges{
                    node{
                        frontmatter{
                            title
                            date
                        }
                        html
                        excerpt
                        timeToRead
                        fields{
                            slug
                        }
                    }
                }
            }
        }`
    )

    return (
        <div>
            <h1>Blog</h1>
           
            <ol>
                {data.allMarkdownRemark.edges.map((edge) =>{
                    return (
                        <li>
                            <Link to={`/blog/${edge.node.fields.slug}`}>
                            <h2>{edge.node.frontmatter.title}</h2>
                <p>{edge.node.frontmatter.date}</p>
                <p>{edge.node.excerpt}</p>
                <p>{edge.node.timeToRead}</p>
                </Link>
                </li>
                    )
                    })}
            </ol>
            
        </div>
    );
}
