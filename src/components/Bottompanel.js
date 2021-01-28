import React from 'react'
import {Box} from '@chakra-ui/react';
import DiseaseTracker from './DiseaseTracker';
import LatestData from '../components/LatestData';

export default function Bottompanel({statistics, region, chart, disease}) {
    return (
        <Box id="bottompanel">
        <DiseaseTracker  statistics={statistics} region={region} chart={chart} disease={disease}/>
        <LatestData latestData={statistics} className="latest-bottompanel"/>
        </Box>       
    )
}
