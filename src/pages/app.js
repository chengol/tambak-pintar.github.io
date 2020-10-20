import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

export const data = graphql`
query{
    allAirtable{
    nodes{
        id
        data{
            Tambak
            Kolam
            Provinsi
            DoC
            AHPND
            Asal_Benur
            Kabupaten
            }
        }
    }
}`

export default function AppPage({data}) {

    
    

      
    return (
        <div>
            App page
            <ol>
                {data.allAirtable.nodes.map((node) => {
                    return(
                        <div>
                            <li>{node.data.Provinsi}</li>
                        <li>{node.data.Kabupaten}</li>
                        <li>{node.data.Tambak}</li>
                        <li>{node.data.Asal_Benur}</li>
                        <li>{node.data.AHPND}</li>
                        <br></br>
                        </div>
                        
                    )
                })}
                
            </ol>
            
        </div>
    )
}
