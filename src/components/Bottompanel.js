import React from 'react'
import {Box} from '@chakra-ui/core';
import DiseaseTracker from './DiseaseTracker';

export default function Bottompanel({points}) {
    return (
        <Box id="bottompanel">
        <DiseaseTracker  points={points}/>
        </Box>       
    )
}
