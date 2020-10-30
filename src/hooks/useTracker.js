import React, {useState, useEffect} from 'react'
import { graphql } from 'gatsby'


const defaultState = {
    data : null,
    state: 'ready'

}

export default function useTracker({data}) {

    const [tracker = {}, updateTracker] = useState(defaultState)

    return (
        <div>
            
        </div>
    )
}
