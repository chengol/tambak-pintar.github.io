import React from 'react'
import {Box} from '@chakra-ui/core';
import DiseaseTracker from './DiseaseTracker';

export default function Bottompanel({points}) {
    return (
        <div>
        <Box m={{sm:5}}>
        <DiseaseTracker  points={points}/>
        </Box>       
      </div>
    )
}
