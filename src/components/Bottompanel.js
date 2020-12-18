import React from 'react'
import {Box} from '@chakra-ui/react';
import DiseaseTracker from './DiseaseTracker';

export default function Bottompanel({points, samples}) {
    return (
        <Box id="bottompanel">
        <DiseaseTracker  points={points} samples={samples}/>
        </Box>       
    )
}
